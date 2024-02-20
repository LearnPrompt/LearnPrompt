import BLOG from '@/blog.config'
import { getPostBlocks } from '@/lib/notion'
import { getGlobalData } from '@/lib/notion/getNotionData'
import { idToUuid } from 'notion-utils'
import { getNotion } from '@/lib/notion/getNotion'
import Slug, { getRecommendPost } from '..'
import { uploadDataToAlgolia } from '@/lib/algolia'
import { checkContainHttp } from '@/lib/utils'

/**
 * 根据notion的slug访问页面
 * 解析二级目录 /article/about
 * @param {*} props
 * @returns
 */
const PrefixSlug = props => {
  return <Slug {...props}/>
}

export async function getStaticPaths() {
  if (!BLOG.isProd) {
    return {
      paths: [],
      fallback: true
    }
  }

  const from = 'slug-paths'
  const { allPages } = await getGlobalData({ from })
  const paths = allPages?.filter(row => checkSlug(row))
    .map(row => ({ params: { prefix: row.slug.split('/')[0], slug: row.slug.split('/')[1] } }))
  return {
    paths: paths,
    fallback: true
  }
}

export async function getStaticProps({ params: { prefix, slug } }) {
  let fullSlug = prefix + '/' + slug
  if (JSON.parse(BLOG.PSEUDO_STATIC)) {
    if (!fullSlug.endsWith('.html')) {
      fullSlug += '.html'
    }
  }
  const from = `slug-props-${fullSlug}`
  const props = await getGlobalData({ from })
  // 在列表内查找文章
  props.post = props?.allPages?.find((p) => {
    return (p.type.indexOf('Menu') < 0) && (p.slug === fullSlug || p.id === idToUuid(fullSlug))
  })

  // 处理非列表内文章的内信息
  if (!props?.post) {
    const pageId = slug.slice(-1)[0]
    if (pageId.length >= 32) {
      const post = await getNotion(pageId)
      props.post = post
    }
  }

  // 无法获取文章
  if (!props?.post) {
    props.post = null
    return { props, revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND) }
  }

  // 文章内容加载
  if (!props?.posts?.blockMap) {
    props.post.blockMap = await getPostBlocks(props.post.id, from)
  }
  // 生成全文索引 && JSON.parse(BLOG.ALGOLIA_RECREATE_DATA)
  if (BLOG.ALGOLIA_APP_ID) {
    uploadDataToAlgolia(props?.post)
  }

  // 推荐关联文章处理
  const allPosts = props.allPages?.filter(page => page.type === 'Post' && page.status === 'Published')
  if (allPosts && allPosts.length > 0) {
    const index = allPosts.indexOf(props.post)
    props.prev = allPosts.slice(index - 1, index)[0] ?? allPosts.slice(-1)[0]
    props.next = allPosts.slice(index + 1, index + 2)[0] ?? allPosts[0]
    props.recommendPosts = getRecommendPost(props.post, allPosts, BLOG.POST_RECOMMEND_COUNT)
  } else {
    props.prev = null
    props.next = null
    props.recommendPosts = []
  }

  delete props.allPages
  return {
    props,
    revalidate: parseInt(BLOG.NEXT_REVALIDATE_SECOND)
  }
}
function checkSlug(row) {
  let slug = row.slug
  if (slug.startsWith('/')) {
    slug = slug.substring(1)
  }
  return (slug.match(/\//g) || []).length === 1 && !checkContainHttp(slug) && row.type.indexOf('Menu') < 0
}
export default PrefixSlug
