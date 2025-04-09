import { Component } from 'react';
import css from './SearchBar.module.css';
import { toast } from 'react-hot-toast';  
import { FaSearch } from 'react-icons/fa';  

export class Searchbar extends Component {
    state = {
        q: '',
    }

  onSearchChange = ({ target: { value } }) => {
      console.log('Input value onChange:', value);  
        this.setState({ q: value });
    }

    onSubmit = (evt) => {
      evt.preventDefault();
      console.log('Current input value:', this.state.q); 

        if (!this.state.q.trim()) {
            toast.error("Please enter text for search!");  
            return;
        }
        this.props.onSubmit(this.state.q);
    }

    render() {
        return (
            <header className={css.searchbar}>
                <form className={css.searchForm} onSubmit={this.onSubmit}>
                    <button type="submit" className={css.searchFormButton}>
                        <FaSearch />  
                    </button>
                    <input
                        onChange={this.onSearchChange}
                        type="text"
                        autoComplete="off"
                        autoFocus
                        placeholder="Search images and photos"
                        name="search"
                        className={css.searchFormInput}
                    />
                </form>
            </header>
        );
    }
}
