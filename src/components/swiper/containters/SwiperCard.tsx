import React, { FC, memo, forwardRef, Ref, ReactElement, useImperativeHandle, useMemo, useState, useEffect } from 'react';
import CardChild from '../components/CardChild';
import { JUMP_TYPE } from '../constants';
// @ts-ignore
import styles from '../index.less';
// 实例类型
export interface SwiperCardRefType {
  toPre: () => void; // 显示前一个
  toNext: () => void; // 显示后一个 
  toTarget: (index: number) => void; // 显示目标
}

// props 类型
interface SwiperCardProps {
  images: string[]; // 轮播图内容 图片地址
  displayNumber?: number; // 展示轮播图片数
  stepInterval?: number; // 时间间隔 默认 3秒
  ref?: Ref<SwiperCardRefType | undefined>; // 实例
}

const SwiperCard: FC<SwiperCardProps> = forwardRef(( { children, images, stepInterval= 3000 }, ref ) => {

  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  useImperativeHandle(ref, () => {
    return {
      toPre,
      toNext,
      toTarget
    }
  });


  // 处理 children 数据 依赖于children变化
  const { swiperChildren , childNum} = useMemo(() => {
    let childNum= 0;
    let imgList: ReactElement[]= [];
    if (images.length !== 0) {
      imgList = React.Children.map(images, src => {
        const child = React.createElement('img', { src }, null)
        if (!React.isValidElement(child)) return null;
        const newChild = React.createElement(CardChild, null, child );
        return newChild;
      })
    }
    // 遍历子元素 查看是否符合子元素规范 
    const swiperChildren = React.Children.map(children, child => {
      // 判断是否为 符合的子元素
      if (!React.isValidElement(child)) return null;
      // 判断子元素是否为规定子元素
      if (child.type !== CardChild) {
        /// 当使用者没有使用 规定的 SwiperChild 组件 我们创造组件SwiperChild插入
        const newChild = React.createElement(CardChild, null, child );
        childNum ++;
        return newChild;
      }
      childNum ++;
      return child;
    });
    return {
      swiperChildren: images.length > 0 ? imgList : swiperChildren,
      childNum,
    }
  }, [children, images]); 

  // 拦截 是否存在子元素 没有 => 直接报错
  if(childNum === 0 && images.length === 0) {
    console.error('没有子元素啊,哥!')
    return null;
  }

  // 显示前一个
  const toPre = () => {
    jump(JUMP_TYPE.PRE)
  };

  // 显示后一个
  const toNext = () => {
    jump(JUMP_TYPE.NEXT)
  };

  // 处理跳转前后逻辑合并
  const jump = (type: string) => {
    if (Array.isArray(swiperChildren)) {
      const last = swiperChildren?.length -1 || 0
      setCurrentIndex(current => {
        if (type === JUMP_TYPE.PRE) {
          if (-- current < 0) {
            return last
          }
          return current --;
        } else if (type === JUMP_TYPE.NEXT) {
          if (++ current > last) {
            return 0
          }
          return current ++;
        }
        return 0
      })
    }
  };

  // 定位到某一个
  const toTarget = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    setCurrentIndex(0);
    const timer= window.setInterval(() => {
      toNext();
    }, stepInterval);
    return () => {
      if(timer) clearInterval(timer);
    }
  }, [])

  return (
    <div className={styles['card-swiper']} >
      {/* 可视区域限制层 */}
      <div className={styles['card-swiper__visual']} id="visual" >
        {
          React.Children.map(swiperChildren, (child, index) => {
            if (!React.isValidElement(child)) return null;          
            const newChild = React.cloneElement(child, {
              index,
              current: currentIndex,
              toTarget,
              length: swiperChildren?.length,
            });
            return newChild;
          })
        }
      </div>
    </div>
  )
});

export default memo(SwiperCard);
