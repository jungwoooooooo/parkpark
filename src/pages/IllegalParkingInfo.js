import React from 'react';
import { useSpring, animated } from '@react-spring/web';

const IllegalParkingInfo = () => {
  const [showImage, setShowImage] = React.useState(false);
  const [showText, setShowText] = React.useState(false);

  const imageAnimation = useSpring({
    opacity: showImage ? 1 : 0,
    transform: showImage ? 'translateY(0)' : 'translateY(-50px)',
    config: { duration: 2000 },
  });

  const textAnimation = useSpring({
    opacity: showText ? 1 : 0,
    transform: showText ? 'translateY(0)' : 'translateY(-20px)',
    config: { duration: 2000 },
  });

  React.useEffect(() => {
    setShowImage(true);
    setShowText(true);
  }, []);

  return (
    <div className="main-content">
      <animated.h1 style={{ ...textAnimation, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>불법주차 구역 정보</animated.h1>
      <br/>
      <animated.h3 style={{ ...textAnimation, textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>5대 불법 주정차 금지구역</animated.h3>
      <animated.p style={{ ...textAnimation, textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        아래 5구역은 절대 주차하면 안 되는 구역으로 지정되어 있습니다. <br/>
        잠시 정차도 허용되지 않는 곳이니 이런 곳에 주차된 차량은 바로 신고하시면 됩니다.
      </animated.p>
      <br/>
      <ul style={{ listStylePosition: 'inside', paddingLeft: '20px' }}>
        <li>소화전 5m 이내 (과태료 8~9만 원)</li>
        <li>횡단보도 위 (과태료 4~5만 원)</li>
        <li>어린이 보호구역 (과태료 12~13만 원)</li>
        <li>교차로 모퉁이 5m 이내 (과태료 4~5만 원)</li>
        <li>버스정류소 10m 이내 (과태료 4~5만 원)</li>
      </ul>
      <animated.img 
        src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FblvPYe%2FbtrubLgdNxB%2FxPhkQgW7KDklcuYrUQkSrK%2Fimg.png" 
        style={{ ...imageAnimation, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
      />
      <br/><br/>
      <animated.h3 style={{ ...textAnimation, textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>도로 노면에 표시된 선으로 불법 여부 파악하기</animated.h3>
      <animated.p style={{ ...textAnimation, textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
        신고하려는 차량이 불법인지 아닌지 파악하는 방법은 도로 노면에 표시된 선으로 쉽게 파악하실 수 있습니다.
      </animated.p>
      <ul style={{ listStylePosition: 'inside', paddingLeft: '20px' }}>
        <li>흰색 실선: 도로와 인도를 구분하는 경계로 주정차가 가능합니다.</li>
        <li>황색 점선: 주차는 불가하고 5분 이내 정차는 가능합니다.</li>
        <li>황색 실선: 특정 요일과 시간 내에 탄력적으로 주정차가 가능합니다.</li>
        <li>황색 복선: 주정차 절대 금지 구역입니다.</li>
      </ul>
      <br/>
      <animated.img 
        src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FRO5QF%2Fbtrt7rW7Xyv%2FUFQut6k96I2VuF2K5CZ1o0%2Fimg.png" 
        alt="도로 노면 표시 예시"
        style={{ ...imageAnimation, borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
      />
      <br/><br/>
      <animated.h3 style={{ ...textAnimation, textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>불법 주정차 신고대상</animated.h3>
      <ul style={{ listStylePosition: 'inside', paddingLeft: '20px' }}>
        <li>5대 불법 주정차 구역: 주정차 금지구역에서 1분 이상 정지상태인 차량</li>
        <li>기타 불법 주정차: 주정차 금지구역에서 10분 이상 정지상태인 차량</li>
      </ul>
    </div>
  );
};

export default IllegalParkingInfo;