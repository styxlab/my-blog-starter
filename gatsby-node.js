const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
	{
    	allGhostPost(sort: { fields: [featured, published_at], order: [DESC, DESC] }) {
        	edges {
            	node {
                	title
                	slug
                }
            }
        }
    }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  await sleep(5000)

  // Create blog posts pages.
  const posts = result.data.allGhostPost.edges
  
  posts.forEach(({ node }, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node
  
    console.log(node.slug)
  
    createPage({
      path: `/${node.slug}/`,
      component: blogPost,
      context: {
        slug: node.slug,
        previous,
        next,
      },
    })
  })
}

//exports.onCreateNode = ({ node, actions, getNode }) => {
//  const { createNodeField } = actions
//
//  if (node.internal.type === `MarkdownRemark`) {
//    const value = createFilePath({ node, getNode })
//    createNodeField({
//      name: `slug`,
//      node,
//      value,
//    })
//  }
//}
