import React, { useEffect, useState } from 'react'

import { useNotionContext } from '../context'
import { cs } from '../utils'
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
  original_url: string
  block?: boolean
  className?: string
}> = ({ original_url, block, className }) => {
  const { components } = useNotionContext()
  const url = new URL(original_url)
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
        setGithubRepo(data)
        setName(data.name)
      })
      .catch((err) => console.error(err))
  }, [name])

  return (
    <components.link
      target='_blank'
      rel='noopener noreferrer'
      href={original_url}
      className={cs(
        'notion-external',
        block ? 'notion-external-block notion-row' : 'notion-external-mention',
        className
      )}
    >
      <div className='notion-external-image'>
        <SvgTypeGitHub />
      </div>
      <div className='notion-external-description'>
        <div className='notion-external-title'>{name}</div>

        {githubRepo && (
          <div className='notion-external-subtitle'>
            {`${
              githubRepo.owner.login
            } • Updated on ${githubRepo.updated_at.substring(0, 10)}`}
          </div>
        )}
      </div>
    </components.link>
  )
}
