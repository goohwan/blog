import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()

  const response = await api.getPage(id)
  id = idToUuid(id)

  // 노션 API 구조 변경: value.value로 접근해야 함
  const collectionData = Object.values(response.collection)[0]?.value as any
  const collection = collectionData?.value || collectionData
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[id].value

  // Check Type - 노션 정책 변경으로 type이 없을 수 있으므로 collection과 schema 존재 여부로 판단
  const isValidDatabase = collection && schema && Object.keys(schema).length > 0
  const isOldTypeDatabase = rawMetadata?.type === "collection_view_page" || rawMetadata?.type === "collection_view"

  if (!isValidDatabase && !isOldTypeDatabase) {
    return []
  } else {
    // Construct Data
    const pageIds = getAllPageIds(response)

    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]

      const properties = (await getPageProperties(id, block, schema)) || null
      // Add fullwidth, createdtime to properties
      // 노션 API 구조 변경: value.value로 접근해야 함
      const blockData = block[id]?.value as any
      const blockValue = blockData?.value || blockData

      properties.createdTime = new Date(
        blockValue?.created_time
      ).toString()
      properties.fullWidth =
        (blockValue?.format as any)?.page_full_width ?? false

      data.push(properties)
    }



    // Sort by date
    data.sort((a: any, b: any) => {
      const dateA: any = new Date(a?.date?.start_date || a.createdTime)
      const dateB: any = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })

    const posts = data as TPosts
    return posts
  }
}
