import ReactModal from 'react-modal';
import styles from './ImageModal.module.css';

ReactModal.setAppElement('#root'); 

export const ImageModal = ({ modalImage, onCloseModal }) => {
  if (!modalImage) {
    return null; 
  }

  const { largeImageURL, tags, user, userUrl, likes, description } = modalImage;

  return (
    <ReactModal
      isOpen={true} 
      onRequestClose={onCloseModal} 
      className={styles.modal} 
      overlayClassName={styles.overlay} 
      closeTimeoutMS={200} 
    >
      <div>
        <img src={largeImageURL} alt={tags} className={styles.modalImage} />
        <div className={styles.modalInfo}>
          <p>
            Photo by{' '}
            <a href={userUrl} target="_blank" rel="noopener noreferrer">{user}</a>
            {' '}on{' '}
            <a href="https://unsplash.com/?utm_source=zoia_image_search&utm_medium=referral" target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>
          </p>
          <p><strong>Likes:</strong> {likes}</p>
          <p><strong>Description:</strong> {description}</p>
        </div>
      </div>
    </ReactModal>
  );
};




