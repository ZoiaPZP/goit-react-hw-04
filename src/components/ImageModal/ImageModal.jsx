import { Component } from 'react';
import styles from './ImageModal.module.css';  

export class ImageModal extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleEscClose);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscClose);
  }

  handleEscClose = (evt) => {
    if (evt.code === 'Escape') this.props.onCloseModal();
  };

  handleOverlayClose = (evt) => {
    if (evt.target === evt.currentTarget) this.props.onCloseModal();
  };

  render() {
    const { modalImage } = this.props;

   
    if (!modalImage || !modalImage.largeImageURL) {
      return null; 
    }

    const { largeImageURL, tags, user, likes, description } = modalImage;

    return (
      <div className={styles.overlay} onClick={this.handleOverlayClose}>
        <div className={styles.modal}>
          <img src={largeImageURL} alt={tags} className={styles.modalImage} />
          <div className={styles.modalInfo}>
            <p><strong>Author:</strong> {user}</p>
            <p><strong>Likes:</strong> {likes}</p>
            <p><strong>Description:</strong> {description}</p>
          </div>
        </div>
      </div>
    );
  }
}

