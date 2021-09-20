import React, { useRef, MutableRefObject } from 'react'
import SwiperCard, { SwiperCardRefType } from '../components/swiper/containters/SwiperCard';
// @ts-ignore
import styles from './index.less';

const imgList = [
  'https://asset.txqn.huohua.cn/assets/3cc65919-2eb4-4263-8491-c3d5d87f9fd6.jpeg',
  'https://asset.txqn.huohua.cn/assets/1df63613-a1c6-4263-9b79-ba501cb3a3fd.jpeg',
  'https://asset.txqn.huohua.cn/assets/ce0fea55-871f-4cd5-86cb-08ba8bf4e7a8.jpeg',
  // 'https://asset.txqn.huohua.cn/assets/909dc096-cfa1-4a38-98fb-36ef33755ca3.jpeg',
  // 'https://asset.txqn.huohua.cn/assets/44894e1e-46cd-4694-ab24-d430228832d5.jpeg',
];

const Index = () => {

  const swiperRef : MutableRefObject<SwiperCardRefType | undefined> = useRef<SwiperCardRefType>();

  return (
    <div className={styles.business}>
      <SwiperCard
        images={imgList}
        ref={swiperRef}
      />
      <div className={styles.btns}>
        <div onClick={() => swiperRef.current?.toPre()} >后退</div>
        <div onClick={() => swiperRef.current?.toNext()} >前进</div>
      </div>
    </div>
  )
}

export default Index;
