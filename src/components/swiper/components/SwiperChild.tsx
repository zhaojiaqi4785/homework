import React, { FC, ReactElement } from 'react'
// @ts-ignore
import styles from '../index.less';
interface Props {
  children: ReactElement | ReactElement[]; // 规定子元素类型
}

const SwiperChild: FC<Props> = ({ children }) => {
  return (
    <div className={styles['swiper-child']}>
      {children}
    </div>
  )
}

export default SwiperChild;
