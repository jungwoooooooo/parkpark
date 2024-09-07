import React, { useEffect, useState } from 'react';
import { useMap } from '../map/MapContext';
import ParkingLotList from './ParkingLotList';

const { kakao } = window;

const ParkingLotLayer = ({ parkingLots }) => {
  const { map } = useMap();
  const [markers, setMarkers] = useState([]);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [visibleParkingLots, setVisibleParkingLots] = useState([]);

  useEffect(() => {
    if (!map || !parkingLots) return;

    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // 클러스터러 생성
    const clusterer = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 5, // 클러스터 할 최소 지도 레벨
      minClusterSize: 2, // 클러스터를 형성하기 위한 최소 마커 개수
      styles: [{
        width: '40px', height: '40px',
        background: 'rgba(51, 204, 255, .8)',
        borderRadius: '20px',
        color: '#000',
        textAlign: 'center',
        lineHeight: '40px',
        transition: 'transform 0.2s ease' // 부드러운 전환 효과 추가
      }]
    });

    // 새로운 마커 생성
    const newMarkers = parkingLots.map(lot => {
      if (lot.경도 && lot.위도) {
        const position = new kakao.maps.LatLng(lot.위도, lot.경도);

        // 요금 정보에 따른 아이콘 URL 설정
        const iconUrl = lot.요금정보 === '무료' 
          ? 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/free-removebg-preview.png?raw=true' // 무료 주차장 아이콘 URL
          : lot.요금정보 === '유료'
          ? 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/fee.png?raw=true' // 유료 주차장 아이콘 URL
          : 'https://github.com/jungwoooooooo/parkpark/blob/master/src/assert/mix.png?raw=true'; // 혼합 주차장 아이콘 URL

        const markerImage = new kakao.maps.MarkerImage(
          iconUrl,
          new kakao.maps.Size(100, 100), // 아이콘 크기 조정 (작게)
          { offset: new kakao.maps.Point(20, 20) } // 아이콘 중심점 조정
        );

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position,
          image: markerImage
        });

        // 마커 하이라이트 효과를 위한 이벤트 추가
        kakao.maps.event.addListener(marker, 'mouseover', () => {
          marker.setImage(new kakao.maps.MarkerImage(
            iconUrl,
            new kakao.maps.Size(150, 150), // 아이콘 크기 증가
            { offset: new kakao.maps.Point(30, 30) }
          ));
        });

        kakao.maps.event.addListener(marker, 'mouseout', () => {
          marker.setImage(markerImage); // 원래 아이콘으로 복원
        });

        // 마커 클릭 이벤트 추가
        kakao.maps.event.addListener(marker, 'click', () => {
          console.log('Marker clicked:', lot);

          if (activeInfoWindow) {
            activeInfoWindow.close();
          }

          // 상세 정보를 표시하는 인포윈도우 콘텐츠 생성
          const detailContent = `
            <div style="padding:5px; background-color:white; border:1px solid black; border-radius:5px;">
              <div><strong>${lot.주차장명}</strong></div>
              <div>요금: ${lot.요금정보}</div>
              <div>잔여 수: ${lot.가능한주차면}</div>
            </div>
          `;

          const infowindow = new kakao.maps.InfoWindow({
            content: detailContent,
            position: marker.getPosition(),
          });

          infowindow.open(map, marker);
          setActiveInfoWindow(infowindow);

          console.log('InfoWindow opened:', lot);

          // 지도 클릭 시 인포윈도우 닫기
          kakao.maps.event.addListener(map, 'click', () => {
            infowindow.close();
            setActiveInfoWindow(null);
            console.log('InfoWindow closed');
          });
        });

        return marker;
      }
      return null;
    }).filter(marker => marker !== null);

    // 클러스터러에 마커 추가
    clusterer.addMarkers(newMarkers);
    setMarkers(newMarkers);

    // 클러스터 마우스오버 이벤트 추가
    kakao.maps.event.addListener(clusterer, 'clusterover', (cluster) => {
      const clusterMarker = cluster.getClusterMarker();
      clusterMarker.getElement().style.transform = 'scale(1.2)'; // 클러스터 확대
    });

    // 클러스터 마우스아웃 이벤트 추가
    kakao.maps.event.addListener(clusterer, 'clusterout', (cluster) => {
      const clusterMarker = cluster.getClusterMarker();
      clusterMarker.getElement().style.transform = 'scale(1)'; // 클러스터 원래 크기로 복원
    });

    // 지도 중심 변경 시 반경 내 주차장 필터링
    const updateVisibleParkingLots = () => {
      const center = map.getCenter();
      const radius = 500; // 반경 1km
      const circle = new kakao.maps.Circle({
        center: center,
        radius: radius
      });

      const bounds = circle.getBounds();

      const visibleLots = parkingLots.filter(lot => {
        const position = new kakao.maps.LatLng(lot.위도, lot.경도);
        return bounds.contain(position);
      });

      setVisibleParkingLots(visibleLots);
    };

    // 지도 이동 이벤트 리스너 추가
    kakao.maps.event.addListener(map, 'center_changed', updateVisibleParkingLots);
    updateVisibleParkingLots(); // 초기 필터링

    // 지도 클릭 시 활성화된 인포윈도우 닫기
    kakao.maps.event.addListener(map, 'click', () => {
      if (activeInfoWindow) {
        activeInfoWindow.close();
        setActiveInfoWindow(null);
        console.log('InfoWindow closed by map click');
      }
    });

  }, [map, parkingLots, activeInfoWindow]);

  return (
    <>
      <ParkingLotList parkingLots={visibleParkingLots} />
      {/* 지도 컴포넌트는 여기에 렌더링됩니다 */}
    </>
  );
};

export default ParkingLotLayer;