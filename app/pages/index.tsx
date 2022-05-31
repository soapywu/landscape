import { useState } from 'react'

import Head from 'next/head'
import { Modal } from '@nextui-org/react'
//@ts-ignore
import lodash from 'lodash'

import LogoCard from '../components/LogoCard'
import { getAllPages } from '../util/airtable'

async function fetchLandscape() {
  return getAllPages('appBnNeFjIsmCH9uz', 'tblWxdcACCFP3g4Sh', {
    maxRecords: 1000,
    pageSize: 100,
    sort: [{ field: 'orderInGroup' }],
  })
}

export async function getStaticProps() {
  const tools = await fetchLandscape()

  return {
    props: {
      tools,
    },
    revalidate: 60 * 5,
  }
}

export default function Home({ tools }: { tools: Array<any> }) {
  const [visible, setVisible] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>({
    name: '',
  })

  const groupedTools = lodash.groupBy(tools, (tool: any) => tool.category)
  //@ts-ignore
  const groupNames = [...new Set(tools.map((tool: any) => tool.category))]

  const closeHandler = () => {
    setVisible(false)
  }

  const extractTwitterUsernameFromUrl = (twitterUrl: string) => {
    try {
      return twitterUrl.replace(/\/$/, '').replace('https://twitter.com/', '@')
    } catch (e) {
      return ''
    }
  }

  const currentItemLogoUrl =
    (currentItem?.logo || []).length > 0
      ? currentItem?.logo[0]?.url
      : currentItem?.logoUrl

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Ethereum Developer Tooling Landscape | DappCamp</title>
      </Head>

      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Body>
          <div className="pb-6">
            <img
              src={currentItemLogoUrl}
              width={'48px'}
              height={'48px'}
              className="mb-4"
              alt={currentItem.title}
            />
            <h1 className="font-bold text-xl mb-2">{currentItem.name}</h1>
            <p className="mb-3">{currentItem.description}</p>
            {currentItem.website && (
              <p className="mb-1">
                <span className="font-semibold">Website:</span>{' '}
                <a
                  href={currentItem.website}
                  target="_blank"
                  className="text-blue-500"
                >
                  {currentItem.website.replace(/\/$/, '')}
                </a>
              </p>
            )}
            {extractTwitterUsernameFromUrl(currentItem.twitter) && (
              <p>
                <span className="font-semibold">Twitter:</span>{' '}
                <a
                  href={currentItem.twitter}
                  target="_blank"
                  className="text-blue-500"
                >
                  {extractTwitterUsernameFromUrl(currentItem.twitter)}
                </a>
              </p>
            )}
          </div>
        </Modal.Body>
      </Modal>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 py-4 lg:px-20 text-center">
        <div className="flex flex-wrap item-center justify-between w-full items-center">
          <h1 className="block mx-0 mt-0 mb-3 text-4xl font-bold text-gray-800 py-2">
            Ethereum Developer Tooling Landscape
          </h1>
          <div>
            <img
              className="w-60 h-auto"
              src="https://www.dappcamp.xyz/dappcamp_logo.png"
              alt="DappCamp Logo"
            />
          </div>
        </div>

        <p className="pb-8 w-full" style={{ textAlign: 'left' }}>
          {`Ethereum and EVM compatible developer tooling landscape`}
        </p>

        <div
          style={{ width: '100%', height: '75vh', overflow: 'scroll' }}
          className="px-2"
        >
          <div
            className="mb-8 grid grid-rows-3 grid-cols-4 gap-x-10 px-4"
            style={{
              width: 'max-content',
              height: 'max-content',
            }}
          >
            {groupNames.map((group) => (
              <div>
                <h2 className="text-lg font-bold pb-1">{group}</h2>
                <div>
                  <div className="grid grid-cols-3 gap-2 items-center justify-center">
                    {groupedTools[group].map((item: any, index: number) => (
                      <LogoCard
                        item={item}
                        onClick={() => {
                          setVisible(true)
                          setCurrentItem(item)
                        }}
                        key={index}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
