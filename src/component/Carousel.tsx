import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import './Carousel.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { BsCheck2 } from 'react-icons/bs';
import fetchFeaturedPlaylists from '../utils/get-top-playlists';

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
  owner: { display_name: string };
  href: string;
}

interface CarouselProps {
  slidesToShow: number;
  slidesToScroll: number;
  dots: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ slidesToShow, slidesToScroll, dots }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getPlaylists = async () => {
      const data = await fetchFeaturedPlaylists();
      setPlaylists(data);
    };

    getPlaylists();
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
    autoplaySpeed: 5000,
    rows: 2,
    slidesPerRow: 1,
    pauseOnDotsHover: true,
    speed: 1200,
    autoplay: true,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    initialSlide: 0,
    arrows: false
  };

  return (
    <div className="carousel-container">
      <h2>Featured</h2>
      <Slider {...settings}>
        {playlists.map((playlist) => (
          <div key={playlist.id} className="carousel-item" onClick={() => handleCopy(playlist.href)}>
            <div className="carousel-item-content">
              <img src={playlist.images[0]?.url} alt={playlist.name} />
              <div className="carousel-item-overlay">
                <h3>{playlist.name}</h3>
                <p>{playlist.owner.display_name}</p>
                {copied === playlist.href && <span className="copied-tooltip"><BsCheck2 /> Copied!</span>}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
