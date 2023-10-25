import React, { useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import {inject} from '@vercel/analytics';

inject();
function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  useEffect(() => {
    const script = document.createElement('script');

    script.src = "https://cdn.wwads.cn/js/makemoney.js";
    script.async = true;
    script.charset = "UTF-8";

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    }
  }, []);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>

      <div className="container">
        <div className="wwads-cn wwads-horizontal wwads-sticky" data-id="290" style={{maxWidth: '350px'}}></div>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}: Empower Your Communication with AI`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
