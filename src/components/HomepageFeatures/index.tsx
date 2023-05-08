import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'ChatGPT',
    Svg: require('@site/static/img/chatgpt.svg').default,
    //undraw_docusaurus_mountain.svg
    description: (
      <>
        最智能的人工智能对话系统
      </>
    ),
  },
  {
    title: 'Midjourney',
    Svg: require('@site/static/img/midjourney.svg').default,
    //undraw_docusaurus_tree.svg
    description: (
      <>
        最高质量的文本生成图片应用
      </>
    ),
  },
  {
    title: 'Runway',
    Svg: require('@site/static/img/runway.svg').default,
    //undraw_docusaurus_react.svg
    description: (
      <>
        输入一句话就可以生成视频的AI神器
      </>
    ),
  },

  {
    title: 'Stable Diffusion',
    Svg: require('@site/static/img/sd.svg').default,
    //undraw_docusaurus_react.svg
    description: (
      <>
        最火的AI绘画软件之一
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  var to_path="docs/basics/intro";
  if(title=='ChatGPT'){
    to_path="docs/basics/intro"
  }
  else if (title=='Midjourney'){
    to_path="docs/Images/intro"
  }
  else if (title=='Runway'){
    to_path='docs/runway/chap1'
  }
  else if (title=='Stable Diffusion'){
    to_path='docs/stable_diffusion/chap1'
  }
  return (
    <div className={clsx('col col--6')}>
     
      <div className="text--center">
        <a href={to_path}><Svg className={styles.featureSvg} role="img" /></a>
        
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
