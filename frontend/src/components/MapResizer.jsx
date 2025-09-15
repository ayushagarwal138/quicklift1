import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const MapResizer = ({ watch }) => {
  const map = useMap();

  useEffect(() => {
    const refresh = () => map.invalidateSize({ animate: false });
    const timers = [0, 150, 400].map((delay) => window.setTimeout(refresh, delay));
    window.addEventListener('resize', refresh);
    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener('resize', refresh);
    };
  }, [map, watch]);

  return null;
};

export default MapResizer;
