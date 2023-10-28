import React, { useEffect } from 'react';
import TOC from '@theme-original/TOC';

export default function TOCWrapper(props) {
  return (
    <>
      <TOC {...props} />
      <div className='wwads-cn wwads-vertical' data-id='290' style={{
        maxWidth: 290
      }}></div>
    </>
  );
}
