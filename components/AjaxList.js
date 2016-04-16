import React from 'react';
import { Link } from 'react-router';
import Spinner from './spinner';

const SCROLL_TIMEOUT = 220;
const CHECK_INTERVAL = SCROLL_TIMEOUT / 2;

function getDocHeight() {
    let D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}

class AjaxList extends React.Component {
	constructor(props){
		super(props);

    this.onScrollEnd = this.onScrollEnd.bind(this);
      this.onScrollStart = this.onScrollStart.bind(this);
      this.onScroll = this.onScroll.bind(this);
      this.checkScroll = this.checkScroll.bind(this);
      
      this.state = {scrolling: false};
      this.scrolling = false;
      this.checkInterval = setInterval(this.checkScroll, CHECK_INTERVAL);
	}

  componentDidMount(){
      window.addEventListener('scroll', this.onScroll, false);   
    }

  componentWillUnmount(){
    window.removeEventListener('scroll', this.onScroll, false);
    clearInterval(this.checkInterval);
  }

  checkScroll(){
    if (Date.now() - this.lastScrollTime > SCROLL_TIMEOUT && this.scrolling) {
      this.scrolling = false;
      this.onScrollEnd();
    }
  }

  onScrollStart(){
    this.setState({scrolling: true});
  }

  onScrollEnd(){
    let doc = document.documentElement;
    let top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    let viewPortHeight = window.innerHeight;
    let bodyHeight = getDocHeight();
    
    // If at bottom
    if ( (bodyHeight - top) == viewPortHeight && !this.props.loading) {
      console.log('---------------Loading More Stuff-----------------');
      this.props.loadMore();
    }
    
    this.setState({scrolling: false});
  }

  onScroll(){
    if (!this.scrolling) {
      this.scrolling = true;
      this.onScrollStart();
    }
    this.lastScrollTime = Date.now();
  }


	render(){
			let pictures = '';
      let loading = '';
			if (this.props.images) {
				pictures = this.props.images.map((p) => {
          return <Link to={'images/' + p.imageName} key={p.imageName}> 
          				<img src={p.imageURL} className='picture' title={p.imageName}/>
          			</Link>;
      	});	
			}
      

      if(!pictures){
          pictures = <p className="pictures">Loading images...</p>;
      }
      

      return (
          <div>
              <h1>Image Gallery</h1>
              <div className="pictures"> {pictures} </div>
              <div className="loadingSpinner"> {this.props.loading ? <Spinner /> : ''} </div>
          </div>
      );
	}
}

export default AjaxList;