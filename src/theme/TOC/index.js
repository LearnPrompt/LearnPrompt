import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';
// Using a custom className
// This prevents TOCInline/TOCCollapsible getting highlighted by mistake
const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';
export default function TOC({className, ...props}) {
  const [renderwwads, setRenderWwads] = useState(false)

  useEffect(()=>{
    setTimeout(()=>{
      setRenderWwads(true)
    }, 2000)
  }, [])

  return (
    <div className={clsx(styles.tableOfContents, 'thin-scrollbar', className)}>
      <TOCItems
        {...props}
        linkClassName={LINK_CLASS_NAME}
        linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
      />

    {
      renderwwads && (
        <div className='wwads-cn wwads-vertical' data-id='290' style={{
          maxWidth: 290
        }}></div>
      )
    }
    
    </div>
  );
}
