import Translate, { translate } from '@docusaurus/Translate'

import CodeBlock from '@theme/CodeBlock'
import FriendCard from './_components/FriendCard'
import { Friends } from '@site/data/friends'
import Layout from '@theme/Layout'
import React from 'react'
import { motion } from 'framer-motion'
import styles from './styles.module.css'

const ADD_FRIEND_URL = 'https://github.com/LearnPrompt/LP/edit/v4/data/friends.tsx'

function FriendHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <h1>
        <Translate>Friends</Translate>
      </h1>
      <p>{translate({ message: 'Having many good friends is better than having a lot of wealth.' })}</p>
      <a className="button button--primary" href={ADD_FRIEND_URL} target="_blank" rel="noreferrer">
        🔗 Link Exchange
      </a>
    </section>
  )
}

function FriendCards() {
  const friends = Friends

  return (
    <section className="margin-top--lg margin-bottom--lg">
      <div className={styles.friendContainer}>
        <ul className={styles.friendList}>
          {friends.map(friend => (
            <FriendCard key={friend.avatar} friend={friend} />
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function FriendLink(): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null)
  const TITLE = 'Friends';
  const DESCRIPTION = 'Having many good friends is better than having a lot of wealth.';

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <motion.main ref={ref} className="margin-vert--md">
        <FriendHeader />
        <FriendCards />
        <motion.div drag dragConstraints={ref} className={styles.dragBox}>
          {/* <SiteInfo /> */}

        </motion.div>
      </motion.main>
    </Layout>
  )
}
