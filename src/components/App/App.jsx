import { Component } from "react";
import { Searchbar } from "../SearchBar/SearchBar";
import { fetchImages, onFetchError } from "../Unsplash/Api";
import { ImageGallery } from "../ImageGallery/ImageGallery";
import { Button } from "../LoadMoreBtn/LoadMoreBtn";
import { Loader } from "../Loader/Loader";
import Notiflix from "notiflix";
import { ImageModal } from "../ImageModal/ImageModal";
import { Toaster } from 'react-hot-toast';

const perPage = 12;

export default class App extends Component {
  state = {
    q: '',
    images: [],
    page: 1,
    loading: false,
    btnLoadMore: false,
    error: null,
    modal: {
      isShowModal: false,
      modalImage: null,
    }
  };

  componentDidMount() {
    if (this.state.q && this.state.page) {
      this.getImages();
    }
  }

  componentDidUpdate(_, prevState) {
    const { q, page } = this.state;
    if (prevState.q !== q || prevState.page !== page) {
      this.getImages();

      
      if (prevState.page !== page) {
        setTimeout(() => {
          const gallery = document.querySelector('ul');
          if (gallery) {
            const scrollHeight = gallery.firstChild?.getBoundingClientRect()?.height || 300;
            window.scrollBy({
              top: scrollHeight * 3 + 30, 
              behavior: 'smooth',
            });
          }
        }, 1200); 
      }
    }
  }

  getImages = async () => {
    const { q, page } = this.state;

    if (!q || !page) {
      Notiflix.Notify.failure('Please enter a valid search query and page number.');
      return;
    }

    try {
      this.setState({ loading: true, btnLoadMore: false });

      const images = await fetchImages(q, page);
      console.log(images); 

      if (images.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again!');
        this.setState({ btnLoadMore: false });
        return;
      }

      const arrPhotos = images.map(({ id, urls, alt_description, user, likes, description }) => ({
        id,
        webformatURL: urls.small,  
        largeImageURL: urls.regular, 
        tags: alt_description || 'photo',
        user: user.name || 'Unknown', 
        likes,
        description: description || 'No description available', 
      }));

      this.setState(prevState => ({
        images: [...prevState.images, ...arrPhotos],
      }));

      if (images.length < perPage) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results");
        this.setState({ btnLoadMore: false });
      } else {
        this.setState({ btnLoadMore: true });
      }

    } catch (error) {
      console.error("Fetch error:", error);
      onFetchError();
    } finally {
      this.setState({ loading: false });
    }
  }

  onSubmitSearchBar = newQ => {
    if (this.state.q === newQ) {
      Notiflix.Notify.info('Enter new request, please!');
      this.setState({ btnLoadMore: false });
      return;
    }

    this.setState({
      q: newQ,
      images: [],
      page: 1,
      error: null,
    });
  }

  onLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  }

  onOpenModal = (image) => {
    
    if (!image || !image.largeImageURL) {
      Notiflix.Notify.failure("Sorry, we couldn't load the image for the modal.");
      return;
    }

    console.log("Modal image URL:", image.largeImageURL); 

    this.setState({
      modal: {
        isShowModal: true,
        modalImage: {
          largeImageURL: image.largeImageURL,
          tags: image.tags || 'photo',
          user: image.user, 
          likes: image.likes, 
          description: image.description, 
        }
      }
    });
  }

  onCloseModal = () => {
    this.setState({
      modal: {
        isShowModal: false,
        modalImage: null,
      }
    });
  }

  render() {
    const { images, btnLoadMore, loading, modal: { modalImage } } = this.state;

    return (
      <>
        <Searchbar onSubmit={this.onSubmitSearchBar} />
        {loading && <Loader />}
        <ImageGallery images={images} onOpenModal={this.onOpenModal} />
        {btnLoadMore && <Button onLoadMore={this.onLoadMore} />}
        {this.state.modal.isShowModal &&
          <ImageModal modalImage={modalImage} onCloseModal={this.onCloseModal} />}
        <Toaster />
      </>
    );
  }
}












