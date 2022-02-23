import React, { useEffect, useState } from 'react'
import { ExternalObjectInstance } from 'notion-types'

import { useNotionContext } from '../context'
import { cs } from '../utils'
import { Text } from './text'
import SvgTypeGitHub from '../icons/type-github'

interface GitHubRepo {
  name: string
  owner: {
    login: string
    avatar_url: string
  }
  updated_at: string
}

export const ExternalComponentGithub: React.FC<{
  block: ExternalObjectInstance
  className?: string
}> = ({ block, className }) => {
  const { components } = useNotionContext()
  const url = new URL(block.format.original_url)
  const [name, setName] = useState<string>(url.pathname.substring(1))
  const [githubRepo, setGithubRepo] = useState<GitHubRepo>()

  useEffect(() => {
    // let's do a call to github api, by extracting repo from url
    fetch(`https://api.github.com/repos/${name}`)
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        }
        return response.json()
      })
      .then((data) => {
        console.log(data)
        setGithubRepo(data)
        setName(data.name)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className='notion-row'>
      <components.link
        target='_blank'
        rel='noopener noreferrer'
        className={cs('notion-external-block', className)}
        href={block.format.original_url}
      >
        <div className='notion-external-image'>
          <SvgTypeGitHub />
        </div>
        <div className='notion-external-description'>
          <div className='notion-external-title'>
            <Text value={[[name]]} block={block} />
          </div>

          {githubRepo && (
            <div className='notion-external-subtitle'>
              <Text
                value={[
                  [
                    `${
                      githubRepo.owner.login
                    } • Updated on ${githubRepo.updated_at.substring(0, 10)}`
                  ]
                ]}
                block={block}
              />
            </div>
          )}
        </div>
      </components.link>
    </div>
  )
}
