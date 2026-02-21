import Group from '../models/Group.js'
import CommunityPost from '../models/CommunityPost.js'
import Reply from '../models/Reply.js'
import GroupMembership from '../models/GroupMembership.js'
import User from '../models/User.js'

// Default groups seeded on first request
const DEFAULT_GROUPS = [
  {
    name: 'Web Development',
    slug: 'web-development',
    icon: '🌐',
    description: 'HTML, CSS, JavaScript, React, Node.js and all things web',
    isOfficial: true,
  },
  {
    name: 'Machine Learning & AI',
    slug: 'machine-learning-ai',
    icon: '🤖',
    description: 'Deep learning, NLP, computer vision and AI tools',
    isOfficial: true,
  },
  {
    name: 'Data Science',
    slug: 'data-science',
    icon: '📊',
    description: 'Data analysis, visualization, statistics and Python',
    isOfficial: true,
  },
  {
    name: 'Mobile Development',
    slug: 'mobile-dev',
    icon: '📱',
    description: 'iOS, Android, React Native, Flutter and mobile',
    isOfficial: true,
  },
  {
    name: 'DevOps & Cloud',
    slug: 'devops-cloud',
    icon: '☁️',
    description: 'Docker, Kubernetes, AWS, CI/CD pipelines',
    isOfficial: true,
  },
  {
    name: 'Cybersecurity',
    slug: 'cybersecurity',
    icon: '🔐',
    description: 'Security fundamentals, ethical hacking and best practices',
    isOfficial: true,
  },
  {
    name: 'System Design',
    slug: 'system-design',
    icon: '🏗️',
    description: 'Architecture, scalability and distributed systems',
    isOfficial: true,
  },
  {
    name: 'Career & Jobs',
    slug: 'career-jobs',
    icon: '💼',
    description: 'Interview prep, resume tips and job hunting strategies',
    isOfficial: true,
  },
  {
    name: 'General Discussion',
    slug: 'general',
    icon: '💬',
    description: 'Off-topic discussions, introductions and community chat',
    isOfficial: true,
  },
]

let seeded = false
const seedDefaultGroups = async () => {
  if (seeded) return
  const count = await Group.countDocuments()
  if (count === 0) await Group.insertMany(DEFAULT_GROUPS)
  seeded = true
}

//   Helper: enrich post objects (strip upvotes array, add counts)
const enrichPost = (p, userId) => ({
  ...p,
  group: p.groupId ?? p.group ?? null,
  groupId: undefined,
  upvoteCount: Array.isArray(p.upvotes) ? p.upvotes.length : 0,
  isUpvoted: userId ? Array.isArray(p.upvotes) && p.upvotes.includes(userId) : false,
  upvotes: undefined,
})

// Groups
export const getGroups = async (req, res) => {
  try {
    await seedDefaultGroups()
    const userId = req.auth?.userId
    const groups = await Group.find().sort({ isOfficial: -1, memberCount: -1 }).lean()

    let memberSet = new Set()
    if (userId) {
      const memberships = await GroupMembership.find({ userId }).select('groupId').lean()
      memberSet = new Set(memberships.map((m) => m.groupId.toString()))
    }

    const result = groups.map((g) => ({ ...g, isMember: memberSet.has(g._id.toString()) }))
    res.json({ success: true, groups: result })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const createGroup = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const { name, description, icon } = req.body
    if (!name?.trim()) return res.json({ success: false, message: 'Group name is required' })

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const existing = await Group.findOne({
      $or: [
        { slug },
        {
          name: {
            $regex: new RegExp(`^${name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
          },
        },
      ],
    })
    if (existing)
      return res.json({ success: false, message: 'A group with this name already exists' })

    const group = await Group.create({
      name: name.trim().slice(0, 60),
      slug,
      description: (description || '').trim().slice(0, 200),
      icon: icon || '💬',
      createdBy: userId,
    })
    // Auto-join creator
    await GroupMembership.create({ userId, groupId: group._id })
    const updated = await Group.findByIdAndUpdate(
      group._id,
      { $inc: { memberCount: 1 } },
      { new: true }
    ).lean()

    res.json({ success: true, group: { ...updated, isMember: true } })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const toggleMembership = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const { groupId } = req.params
    const existing = await GroupMembership.findOne({ userId, groupId })

    if (existing) {
      await GroupMembership.deleteOne({ userId, groupId })
      await Group.findByIdAndUpdate(groupId, { $inc: { memberCount: -1 } })
      res.json({ success: true, isMember: false })
    } else {
      await GroupMembership.create({ userId, groupId })
      await Group.findByIdAndUpdate(groupId, { $inc: { memberCount: 1 } })
      res.json({ success: true, isMember: true })
    }
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Posts
export const getPosts = async (req, res) => {
  try {
    const userId = req.auth?.userId
    const { groupId, tab = 'all', page = 1 } = req.query
    const LIMIT = 15
    const skip = (parseInt(page) - 1) * LIMIT

    // Build base query
    const query = {}
    if (groupId) {
      query.groupId = groupId
    } else if (tab === 'myGroups' && userId) {
      const memberships = await GroupMembership.find({ userId }).select('groupId').lean()
      query.groupId = { $in: memberships.map((m) => m.groupId) }
    }

    let posts, total

    if (tab === 'trending') {
      // Sort by upvote count using aggregation
      const pipeline = [
        { $match: query },
        { $addFields: { upvoteCount: { $size: '$upvotes' } } },
        { $sort: { upvoteCount: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: LIMIT },
        {
          $lookup: {
            from: 'communitygroups',
            localField: 'groupId',
            foreignField: '_id',
            as: 'groupArr',
          },
        },
        { $addFields: { group: { $arrayElemAt: ['$groupArr', 0] } } },
        { $project: { groupArr: 0 } },
      ]
      posts = await CommunityPost.aggregate(pipeline)
      total = await CommunityPost.countDocuments(query)
    } else {
      const raw = await CommunityPost.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(LIMIT)
        .populate('groupId', 'name slug icon')
        .lean()
      posts = raw.map((p) => ({ ...p, group: p.groupId, groupId: undefined }))
      total = await CommunityPost.countDocuments(query)
    }

    const enriched = posts.map((p) => enrichPost(p, userId))
    res.json({ success: true, posts: enriched, hasMore: skip + posts.length < total, total })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const createPost = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const { title, content, groupId, tags } = req.body
    if (!title?.trim() || !content?.trim()) {
      return res.json({ success: false, message: 'Title and content are required' })
    }

    const author = await User.findById(userId)
    if (!author) return res.json({ success: false, message: 'User not found' })

    const parsedTags = Array.isArray(tags)
      ? tags
          .map((t) => t.trim())
          .filter(Boolean)
          .slice(0, 5)
      : typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 5)
        : []

    const post = await CommunityPost.create({
      authorId: userId,
      authorName: author.name,
      authorImage: author.imageUrl || '',
      groupId: groupId || null,
      title: title.trim().slice(0, 200),
      content: content.trim().slice(0, 5000),
      tags: parsedTags,
    })

    if (groupId) await Group.findByIdAndUpdate(groupId, { $inc: { postCount: 1 } })

    const populated = await CommunityPost.findById(post._id)
      .populate('groupId', 'name slug icon')
      .lean()
    res.json({
      success: true,
      post: enrichPost({ ...populated, group: populated.groupId }, userId),
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const getPost = async (req, res) => {
  try {
    const userId = req.auth?.userId
    const post = await CommunityPost.findById(req.params.postId)
      .populate('groupId', 'name slug icon')
      .lean()
    if (!post) return res.json({ success: false, message: 'Post not found' })

    // Replies: accepted answer first, then by upvote count desc
    const rawReplies = await Reply.find({ postId: post._id })
      .sort({ isAcceptedAnswer: -1, createdAt: 1 })
      .lean()

    const replies = rawReplies.map((r) => ({
      ...r,
      upvoteCount: r.upvotes.length,
      isUpvoted: userId ? r.upvotes.includes(userId) : false,
      upvotes: undefined,
    }))

    res.json({
      success: true,
      post: { ...enrichPost({ ...post, group: post.groupId }, userId), replies },
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const togglePostUpvote = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const post = await CommunityPost.findById(req.params.postId)
    if (!post) return res.json({ success: false, message: 'Post not found' })

    const idx = post.upvotes.indexOf(userId)
    idx > -1 ? post.upvotes.splice(idx, 1) : post.upvotes.push(userId)
    await post.save()

    res.json({ success: true, upvoteCount: post.upvotes.length, isUpvoted: idx === -1 })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Post is resolved or not
export const toggleResolve = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const post = await CommunityPost.findById(req.params.postId)
    if (!post) return res.json({ success: false, message: 'Post not found' })
    if (post.authorId !== userId)
      return res.status(403).json({ success: false, message: 'Only the post author can do this' })

    post.isResolved = !post.isResolved
    await post.save()
    res.json({ success: true, isResolved: post.isResolved })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const deletePost = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const post = await CommunityPost.findById(req.params.postId)
    if (!post) return res.json({ success: false, message: 'Post not found' })
    if (post.authorId !== userId)
      return res.status(403).json({ success: false, message: 'Not authorized' })

    await Reply.deleteMany({ postId: post._id })
    if (post.groupId) await Group.findByIdAndUpdate(post.groupId, { $inc: { postCount: -1 } })
    await CommunityPost.deleteOne({ _id: post._id })
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Replies
export const createReply = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const { content } = req.body
    if (!content?.trim()) return res.json({ success: false, message: 'Reply content is required' })

    const post = await CommunityPost.findById(req.params.postId)
    if (!post) return res.json({ success: false, message: 'Post not found' })

    const author = await User.findById(userId)
    if (!author) return res.json({ success: false, message: 'User not found' })

    const reply = await Reply.create({
      postId: post._id,
      authorId: userId,
      authorName: author.name,
      authorImage: author.imageUrl || '',
      content: content.trim().slice(0, 3000),
    })

    post.replyCount += 1
    await post.save()

    res.json({
      success: true,
      reply: { ...reply.toObject(), upvoteCount: 0, isUpvoted: false, upvotes: undefined },
    })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Upvote or not in Reply
export const toggleReplyUpvote = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const reply = await Reply.findById(req.params.replyId)
    if (!reply) return res.json({ success: false, message: 'Reply not found' })

    const idx = reply.upvotes.indexOf(userId)
    idx > -1 ? reply.upvotes.splice(idx, 1) : reply.upvotes.push(userId)
    await reply.save()

    res.json({ success: true, upvoteCount: reply.upvotes.length, isUpvoted: idx === -1 })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// Accept answer on post
export const acceptAnswer = async (req, res) => {
  try {
    const userId = req.auth?.userId
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' })

    const post = await CommunityPost.findById(req.params.postId)
    if (!post) return res.json({ success: false, message: 'Post not found' })
    if (post.authorId !== userId)
      return res
        .status(403)
        .json({ success: false, message: 'Only the post author can accept an answer' })

    const reply = await Reply.findById(req.params.replyId)
    if (!reply) return res.json({ success: false, message: 'Reply not found' })

    // Toggle: unaccept everything first
    await Reply.updateMany({ postId: post._id }, { isAcceptedAnswer: false })

    const nowAccepted = !reply.isAcceptedAnswer
    if (nowAccepted) {
      await Reply.findByIdAndUpdate(reply._id, { isAcceptedAnswer: true })
      post.isResolved = true
      await post.save()
    }

    res.json({ success: true, isAcceptedAnswer: nowAccepted, postResolved: post.isResolved })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}
