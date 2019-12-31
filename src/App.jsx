import Tracks from './component/Tracks';
import Menu from './component/Menu';
import Player from './component/Player';
import React, { Component } from 'react';
import { menuUpdate } from './redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './App.scss';
import noise from './res/noise.png';
import gsap from 'gsap';
import CSSRulePlugin from 'gsap/CSSRulePlugin';
export class App extends Component {
  componentDidUpdate(prevProps, prevState) {
    const { background, color, isInit } = this.props;
    if (prevProps.background !== background || prevProps.color !== color) {
      const { ref } = this;
      const thumb = CSSRulePlugin.getRule('::-webkit-scrollbar-thumb');
      gsap
        .timeline()
        .add('colorChanged')
        .to(ref, { background: background, color: color }, 'colorChanged')
        .to(thumb, { background: background }, 'colorChanged')
        .to('body', { 'scrollbar-face-color': background }, 'colorChanged');
      // gsap.to(track,{ background:background});
      // ::-webkit-scrollbar-thumb {
      //   background: $foreground-color;
      // }

      // ::-webkit-scrollbar-track {
      //   background: $background-color;
      // }

      // // For Internet Explorer
      // body

      // scrollbar-face-color: black;
      // scrollbar-track-color: #00000055;
    }
    if (prevProps.isInit !== isInit) {
      gsap.to('.loadingPg', {
        opacity: 0,
        onComplete: () => {
          gsap.set('.loadingPg', { pointerEvents: 'none' });
        }
      });
    }
  }

  render() {
    const { menuUpdate, colorInvert, color } = this.props;
    const { isMobile, isSafari, isChrome } = window;
    return (
      <div style={{ background: `${colorInvert}99` }} className='bgOut'>
        <div ref={x => (this.ref = x)} className='App'>
          <div className='bg' style={{ backgroundImage: `url(${noise})` }}></div>
          <div
            className='left'
            onMouseEnter={() => {
              menuUpdate({ isOpen: true });
            }}
          >
            <Menu />
          </div>
          <div
            className='right'
            onMouseEnter={() => {
              menuUpdate({ isOpen: false });
            }}
          >
            <div className='rightTop'>
              <Tracks />
            </div>
            <div className='rightBottom'>
              <Player />
            </div>
          </div>
          <div className='loadingPg'>
            <div className='content'>
              <div className='logo'>NOVINYL</div>
              <div className='loading'>loading</div>
            </div>
          </div>
          {isMobile && (
            <div style={{ color: color }} className='Warning'>
              不支援行動裝置 ifram autoplay issue
            </div>
          )}
          {!isMobile && isSafari && (
            <div style={{ color: color }} className='Warning'>
              Safari 瀏覽器請先至設定允許此頁面的自動撥放
            </div>
          )}
          {!isMobile && !isChrome && !isSafari && (
            <div style={{ color: color }} className='Warning'>
              使用 Chrome 獲得最佳體驗
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  SelectorIsOpen: state.Selector.isOpen,
  background: state.UI.background,
  color: state.UI.color,
  colorInvert: state.UI.colorInvert,
  isInit: state.UI.isInit
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      menuUpdate
    },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(App);
