import React, { ReactElement, FC, Ref, forwardRef, useLayoutEffect, useMemo, useState, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
// 组件引入
import SwiperChild from '../components/SwiperChild';
// @ts-ignore
import styles from '../index.less';

export interface SwiperRefType {
  toPre: () => void;
  toNext: () => void;
}

interface Props {
  children?: ReactElement | ReactElement[]; // 传入轮播组件的子元素 定义
  ref?: Ref<SwiperRefType | undefined>; // 实例
}

const clientWidth = document.body?.clientWidth; 
/**
 * 轮播图组件
 */
const Swiper: FC<Props> = forwardRef(({ children }, ref) => {

  const [x, setX] = useState<number>(0);
  const [childList, setChildList] = useState<ReactElement[] | undefined>([]);

  const width= 80, spacing= 4;

  useImperativeHandle(ref, () => {
    return {
      toPre,
      toNext,
    }
  });

  // 处理 children 数据 依赖于children变化
  const { swiperChildren , childNum} = useMemo(() => {
    let childNum = 0;
    // 遍历子元素 查看是否符合子元素规范 
    const swiperChildren = React.Children.map(children, child => {
      // 判断是否为 符合的子元素
      if (!React.isValidElement(child)) return null;
      // 判断子元素是否为规定子元素
      if (child.type !== SwiperChild) {
        /// 当使用者没有使用 规定的 SwiperChild 组件 我们创造组件SwiperChild插入
        const newChild = React.createElement(SwiperChild, null, child );
        childNum ++;
        return newChild;
      }
      childNum ++;
      return child;
    });
    return {
      swiperChildren,
      childNum
    }
  }, [children]); 

  // 拦截 是否存在子元素 没有 => 直接报错
  if(childNum === 0) {
    console.error('没有子元素啊,哥!')
    return null;
  }
    // 总长度
  const childrenWidth = useMemo(() => {
    const num = childNum << 1; // 克隆后元素个数
    return num * clientWidth * (width/100) + (num - 1) * clientWidth * (spacing/100);
  }, [childNum])

  // clone后的元素
  const allSwiperChildren = useMemo(() => {
    return React.Children.map(swiperChildren?.concat(swiperChildren), (child, index) => {
      // 判断是否为 符合的子元素
      if (!React.isValidElement(child)) return null;
      const newChild = React.cloneElement(child, { key: index })
      return newChild;
    })
  }, [swiperChildren]);

  // 区分是上一个 下一个操作
  const changeSwiper = (type: string) => {
    setChildList(childList => {
      if(childList?.length === 0) return [];
      if (type === 'pre') {
        const last = childList?.pop();
        if (!React.isValidElement(last)) return [];
        childList?.unshift(last)
      } else if (type === 'next') {
        const first = childList?.shift();
        if (!React.isValidElement(first)) return [];
        childList?.push(first)
      }
      // @ts-ignore
      return [...childList];
    })
  }

  // 上一个 
  const toPre = () => {
    const { newX, t } = mobileSpacing('pre');
    if (x < 0 && t > 0) {
      changeSwiper('pre');
    } else {
      setX(newX);
    }
  };

  // 下一个
  const toNext = () => {
    const { newX, t } = mobileSpacing('next');
    if (x < 0 && childrenWidth < Math.abs(t)) {
      changeSwiper('next')
    } else {
      console.log(newX, 'next');
      setX(newX);
    }
  };

  // 计算 单次针对上一次 移动的间距
  const mobileSpacing = (type: string) => {
    const t = clientWidth * (((width/100)/2)+ ((spacing/100)/2)); // 移动宽度 宽度/2 间距/2
    console.log((width/100), 't');
    
    switch(type) {
      case 'pre':
        return {
          newX: x + (t << 1),
          t: x + ((t << 1) << 1) + clientWidth * (spacing/100)
        };
      case 'next':
        return {
          newX: x - (t << 1),
          t: x - (((t << 1) << 1) + clientWidth * (spacing/100))
        };
      default:
        console.warn('暂无该类型计算, 请添加类型');
        return {
          newX: 0,
          t
        };
    }
  };

  useLayoutEffect(() => {
    document.body.style.setProperty('--swiperItemWidth', `${width}vw`);
    document.body.style.setProperty('--swiperItemSpacing', `${spacing}vw`);
    setChildList(allSwiperChildren);
    const half = childrenWidth >> 1 ;
    const t = clientWidth * (spacing/100); // 移动宽度 间距
    setX(-half + t); // 总长度的一半 减去 一个间距
  }, [])

  return (
    <div className={styles['my-swiper']} >
      {/* 可视区域限制层 */}
      <div className={styles['my-swiper__visual']}>
        {
          React.Children.map(childList, (child, index) => {
            return (
              <motion.div
                className="my-swiper__visual__motion" 
                animate={{ x }}
                key={index}
              >
                {child}
              </motion.div>
            );
          })
        }
      </div>
    </div>
  )
})
export default React.memo(Swiper);

