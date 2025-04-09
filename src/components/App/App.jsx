import { useState, useEffect, useCallback } from "react";
import { Searchbar } from "../SearchBar/SearchBar";
import { fetchImages, onFetchError } from "../Unsplash/Api";
import { ImageGallery } from "../ImageGallery/ImageGallery";
import { Button } from "../LoadMoreBtn/LoadMoreBtn";
import { Loader } from "../Loader/Loader";
import Notiflix from "notiflix";
import { ImageModal } from "../ImageModal/ImageModal";
import { Toaster } from "react-hot-toast";

const perPage = 12;

export default function App() {
  const [q, setQ] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [btnLoadMore, setBtnLoadMore] = useState(false);
  
  const [modal, setModal] = useState({
    isShowModal: false,
    modalImage: null,
  });

  const getImages = useCallback(async () => {
    if (!q || !page) {
      Notiflix.Notify.failure("Please enter a valid search query and page number.");
      return;
    }

    try {
      setLoading(true);
      setBtnLoadMore(false);

      const images = await fetchImages(q, page);
      console.log(images);

      if (images.length === 0) {
        Notiflix.Notify.failure(
          "Sorry, there are no images matching your search query. Please try again!"
        );
        setBtnLoadMore(false);
        return;
      }

      const arrPhotos = images.map(
        ({ id, urls, alt_description, user, likes, description }) => ({
          id,
          webformatURL: urls.small,
          largeImageURL: urls.regular,
          tags: alt_description || "photo",
          user: user.name || "Unknown",
          likes,
          description: description || "No description available",
        })
      );

      setImages((prevImages) => [...prevImages, ...arrPhotos]);

      if (images.length < perPage) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results"
        );
        setBtnLoadMore(false);
      } else {
        setBtnLoadMore(true);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      onFetchError();
    } finally {
      setLoading(false);
    }
  }, [q, page]);

  useEffect(() => {
    if (q && page) {
      getImages();
    }
  }, [q, page, getImages]);

  const onSubmitSearchBar = (newQ) => {
    if (q === newQ) {
      Notiflix.Notify.info("Enter new request, please!");
      setBtnLoadMore(false);
      return;
    }

    setQ(newQ);
    setImages([]);
    setPage(1);
    
  };

  const onLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const onOpenModal = (image) => {
    if (!image || !image.largeImageURL) {
      Notiflix.Notify.failure("Sorry, we couldn't load the image for the modal.");
      return;
    }

    console.log("Modal image URL:", image.largeImageURL);

    setModal({
      isShowModal: true,
      modalImage: {
        largeImageURL: image.largeImageURL,
        tags: image.tags || "photo",
        user: image.user,
        likes: image.likes,
        description: image.description,
      },
    });
  };

  const onCloseModal = () => {
    setModal({
      isShowModal: false,
      modalImage: null,
    });
  };

  return (
    <>
      <Searchbar onSubmit={onSubmitSearchBar} />
      {loading && <Loader />}
      <ImageGallery images={images} onOpenModal={onOpenModal} />
      {btnLoadMore && <Button onLoadMore={onLoadMore} />}
      {modal.isShowModal && (
        <ImageModal modalImage={modal.modalImage} onCloseModal={onCloseModal} />
      )}
      <Toaster />
    </>
  );
}












