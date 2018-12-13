import * as React from 'react';

import ImageDiffSwipe from './ImageDiffSwipe/ImageDiffSwipe';
import ImageDiffLoupe from './ImageDiffLoupe/ImageDiffLoupe';
import ImageDiffOnionSkin from './ImageDiffOnionSkin/ImageDiffOnionSkin';

import './types';
import './FailBox.css';
import { ImagesInfo } from '../types';

export default class FailBox extends React.PureComponent<ImagesInfo, IFailBoxState> {
  public state = {
    tabId: 0,
    valueSwipe: 0.5,
    valueOnionSkin: 0.5,
    valueLoupe: 2,
  };
  public textModItem = ['3-up', 'Only Diff', 'Loupe', 'Swipe', 'Onion Skin'];
  public getBoxContent(): JSX.Element {
    const { expectedPath, actualPath, diffPath } = this.props;
    return (
      <>
        {this.getBoxItem('Expected', 'green', expectedPath)}
        {this.getBoxItem('Actual', 'red', actualPath)}
        {this.getBoxItem('Diff', 'gray', diffPath)}
      </>
    );
  }

  public getBoxContentDiff(): JSX.Element {
    const { diffPath } = this.props;
    return <>{this.getBoxItem('Diff', 'gray', diffPath)}</>;
  }

  public getBoxContentSwipe(): JSX.Element {
    const { valueSwipe } = this.state;
    const { expectedPath, actualPath } = this.props;
    return (
      <div className='BoxContentSwipe d-flex flex-column'>
        <ImageDiffSwipe
          before={expectedPath}
          after={actualPath}
          value={valueSwipe}
          className='BoxContentSwipe-ImageDiff'
        />
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          defaultValue={`${this.state.valueSwipe}`}
          onChange={this.handleInputChange}
          className='BoxContentSwipe-Range mt-2'
        />
      </div>
    );
  }

  public handleInputChange = (e) => {
    return this.setState({ valueSwipe: parseFloat(e.target.value) });
  }
  public handleInputChangeOnion = (e) => {
    return this.setState({ valueOnionSkin: parseFloat(e.target.value) });
  }

  public getBoxItem(cn: string, color: string, imgPath: string): JSX.Element {
    return (
      <div className={cn}>
        <p className={`Title text-${color} text-bold`}>{cn}</p>
        <img src={imgPath} alt={`${cn}-Img`} className={`FailBox-Img border border-${color}`} />
      </div>
    );
  }

  public getItem(item: string, key: number): JSX.Element {
    const { tabId } = this.state;
    const isSelected = tabId === key ? 'selected' : '';
    return (
      <li key={key} className='modNav-item'>
        <a href='#url' className={`modNav-item-link ${isSelected}`} onClick={this.handleClickAtTab(key)}>
          {item}
        </a>
      </li>
    );
  }

  public getViewModItem(textItems: string[]): JSX.Element[] {
    return textItems.map((item, index) => {
      return this.getItem(item, index);
    });
  }
  public handleClickAtTab = (id: number) => {
    return () => this.setState({ tabId: id });
  }
  public getViewMod() {
    return (
      <>
        <nav className='modNav m-0 pt-1 pb-1' aria-label='Foo bar'>
          <ul className='modNav-body'>{this.getViewModItem(this.textModItem)}</ul>
        </nav>
      </>
    );
  }

  public getBoxContentLoupe() {
    const { expectedPath, actualPath } = this.props;
    const { valueLoupe } = this.state;
    return (
      <div className='BoxContentLoupe d-flex flex-column'>
        <ImageDiffLoupe
          before={expectedPath}
          after={actualPath}
          zoom={valueLoupe}
          className='BoxContentLoupe-ImageDiff'
        />
        <input
          type='range'
          min={1}
          max={3}
          step={0.01}
          defaultValue={`${valueLoupe}`}
          onChange={this.handleInputChangeLoupe}
          className='BoxContentLoupe-range mt-2'
        />
      </div>
    );
  }

  public handleInputChangeLoupe = (e) => {
    this.setState({ valueLoupe: parseFloat(e.target.value) });
  }

  public getBoxContentOnionSkin() {
    const { expectedPath, actualPath } = this.props;
    const { valueOnionSkin } = this.state;

    return (
      <div className='BoxContentOnionSkin d-flex flex-column'>
        <ImageDiffOnionSkin
          before={expectedPath}
          after={actualPath}
          value={valueOnionSkin}
          className='BoxContentOnionSkin-ImageDiff'
        />
        <input
          type='range'
          min={0}
          max={1}
          step={0.01}
          defaultValue={`${valueOnionSkin}`}
          onChange={this.handleInputChangeOnion}
          className='BoxContentOnionSkin-range mt-2'
        />
      </div>
    );
  }

  public getView() {
    let view: any = null;
    switch (this.state.tabId) {
      case 0:
        view = this.getBoxContent();
        break;
      case 1:
        view = this.getBoxContentDiff();
        break;
      case 2:
        view = this.getBoxContentLoupe();
        break;
      case 3:
        view = this.getBoxContentSwipe();
        break;
      case 4:
        view = this.getBoxContentOnionSkin();
        break;

      default:
        view = this.getBoxContent();
    }
    return view;
  }

  public render(): JSX.Element {
    return (
      <>
        <div className={`Box-row Box-row--darkgray d-flex flex-justify-center`}>{this.getView()}</div>
        <div className={`Box-footer Box-row--gray p-0`}>{this.getViewMod()}</div>
      </>
    );
  }
}