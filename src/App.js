import {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import './App.css'
import SearchContext from './SearchContext'
import LoginForm from './components/LoginForm'
import Header from './components/Header'
import Home from './components/Home'

class App extends Component {
  state = {
    isDark: false,
    searchInput: '',
    searchPostView: false,
  }

  changeSearch = result => {
    this.setState({searchInput: result})
  }

  enterSearch = () => {
    this.setState(prevState => ({
      searchPostView: !prevState.searchPostView,
    }))
  }

  render() {
    const {isDark, searchInput, searchPostView} = this.state

    return (
      <SearchContext.Provider
        value={{
          isDark,
          searchInput,
          searchPostView,
          changeSearchInput: this.changeSearch,
          enterSearchButton: this.enterSearch,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <Route exact path="/" component={Home} />
          <Route exact path="/header" component={Header} />
        </Switch>
      </SearchContext.Provider>
    )
  }
}

export default App
