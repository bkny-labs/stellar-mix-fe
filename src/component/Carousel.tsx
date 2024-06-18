import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import fetchNewReleases from '../utils/get-top-artists';
import './Carousel.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BsCheck2 } from 'react-icons/bs';

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  artists: { name: string }[];
  href: string;
}

interface CarouselProps {
  slidesToShow: number;
  slidesToScroll: number;
  dots: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ slidesToShow, slidesToScroll, dots }) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getAlbums = async () => {
      const data = await fetchNewReleases();
      setAlbums(data);
    };

    getAlbums();
  }, []);

  useEffect(() => {
    if (copied) {
      timerRef.current = setTimeout(() => setCopied(null), 2000);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [copied]);

  const handleCopy = (spotifyLink: string) => {
    navigator.clipboard.writeText(spotifyLink).then(() => {
      setCopied(spotifyLink);
    }, () => {
      console.error('Failed to copy the link');
    });
  };

  const settings = {
    dots: dots,
    infinite: true,
    speed: 1000,
    autoplay: true,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    initialSlide: 0,
    arrows: false
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {albums.map((album) => (
            <div key={album.id} className="carousel-item" onClick={() => handleCopy(album.href)}>
              <div className="carousel-item-content">
                <img src={album.images[0]?.url} alt={album.name} />
                <div className="carousel-item-overlay">
                  <h3>{album.name}</h3>
                  <p>{album.artists.map(artist => artist.name).join(', ')}</p>
                  {copied === album.href && <span className="copied-tooltip"><BsCheck2 /> Playlist copied!</span>}
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
};

export default Carousel;
