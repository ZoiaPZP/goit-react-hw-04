import ImageCard from '../ImageCard/ImageCard';
import css from './ImageGallery.module.css';

export const ImageGallery = ({ images, onOpenModal }) => {
  console.log('Images received in ImageGallery:', images); 

  return (
    <ul className={css.imageGallery}>
      {images &&
        images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onOpenModal={onOpenModal}
          />
        ))}
    </ul>
  );
};








