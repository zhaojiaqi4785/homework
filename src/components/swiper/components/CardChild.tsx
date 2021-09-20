import React, { FC, ReactElement, memo, useReducer, useLayoutEffect, useMemo, useState} from 'react';
import classnames from 'classnames';
import { CARD_CHILD_SCALE } from '../constants';
// @ts-ignore
import styles from '../index.less';
interface Props {
  children: ReactElement | ReactElement[]; // 规定子元素类型
  current: number; // 当前展示在最前面的索引
  index: number; // 当前的索引
  toTarget: (index: number) => void; // 设置当前索引的方法
  length: number; // 数组长度
}

interface actionType {
  type: string;
}

// 针对切换时候的scale的值进行调整 纯函数
const cardChildScale = ( _state: number, action: actionType) => {
  switch (action.type) {
    case CARD_CHILD_SCALE.CURRENT:
      return 1
    case CARD_CHILD_SCALE.ORDINARY:
      return 0.8
    default:
      console.error('暂无此类型');
      return 0.8
  }
};

const CardChild: FC<Props> = ({ children, current, index, toTarget, length }) => {

  const [scale, dispatch] = useReducer(cardChildScale, 0.8);
  const [animate, setAnimate] = useState<boolean>(true);

  useLayoutEffect(() => {
    // 判断为当前索引设置 scale 属性
    if (current === index ) {
      dispatch({ type: CARD_CHILD_SCALE.CURRENT })
    } else {
      dispatch({ type: CARD_CHILD_SCALE.ORDINARY})
    }
  })

  // item 点击事件执行 
  const handleItemClick = () => {
    // 设置本组件为current 
    toTarget(index);
    dispatch({ type: CARD_CHILD_SCALE.CURRENT })
  };

  // 计算 移动距离
  const translate = useMemo(() => {
    // 父组件 宽度
    const fatherWidth = document.getElementById('visual')?.offsetWidth || 375;
    const inStage = Math.round(Math.abs(index - current)) <= 1;
    setAnimate(true);
    if(inStage) {
      return fatherWidth * ((2 - scale) * (index - current) + 1) / 4;
    } else if (index < current){
      if(index === 0 && current === (length -1)) {
        return (1 + scale) * fatherWidth / 3
      }
      return -(1 + scale) * fatherWidth / 4;
    } else {
      if(current === 0 && index === (length -1)) {
        return 0
      }
      // setAnimate(true);
      return (3 + scale) * fatherWidth / 3;
    }
  }, [scale, index, current]);

  return (
      <div 
        className={classnames(styles['card-child'], {
          [styles['is-active']]: current === index,
          [styles['is-inStage']]: Math.round(Math.abs(index - current)) <= 1,
          [styles['is-animate']]: animate
        })}
        onClick={handleItemClick}
        style={{
          WebkitTransform: `translateX(${ translate }px) scale(${ scale }) translateZ(1px)`,
          transform: `translateX(${ translate }px) scale(${ scale }) translateZ(1px)`,
        }}
      >
        {
          !(current === index) && (
            <div className={styles['card-child__mask']} />
          )
        }
        {children}
      </div>

  )
}

export default memo(CardChild);
