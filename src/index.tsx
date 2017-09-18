import React from 'react';
import classNames from 'classnames';
import BaseComponent, { PropsType as BasePropsType, StateType as BaseStateType } from './base';
import InputHandler from './InputHandler';

function noop() {
}

function preventDefault(e: any) {
  e.preventDefault();
}

export interface PropsType extends BasePropsType {
  className?: any;
  focusOnUpDown?: boolean;
  prefixCls?: string;
  tabIndex?: number;
  upHandler?: React.ReactNode;
  downHandler?: React.ReactNode;
  formatter?: (v: any) => void;
}
export interface StateType extends BaseStateType { }

export default class InputNumber extends BaseComponent<PropsType, StateType> {

  static defaultProps = {
    ...BaseComponent.defaultProps,
    focusOnUpDown: false,
    useTouch: false,
    prefixCls: 'rmc-input-number',
  };

  start: any;
  end: any;
  input: any;

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentWillUpdate() {
    try {
      this.start = this.input.selectionStart;
      this.end = this.input.selectionEnd;
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  }

  componentDidUpdate() {
    if (this.props.focusOnUpDown && this.state.focused) {
      const selectionRange = this.input.setSelectionRange;
      if (selectionRange &&
        typeof selectionRange === 'function' &&
        this.start !== undefined &&
        this.end !== undefined &&
        this.start !== this.end) {
        this.input.setSelectionRange(this.start, this.end);
      } else {
        this.focus();
      }
    }
  }

  setInput = (input: any) => {
    this.input = input;
  }

  getRatio(e: any) {
    let ratio = 1;
    if (e.metaKey || e.ctrlKey) {
      ratio = 0.1;
    } else if (e.shiftKey) {
      ratio = 10;
    }
    return ratio;
  }

  getValueFromEvent(e: any) {
    return e.target.value;
  }

  focus() {
    this.input.focus();
  }

  formatWrapper(num: any) {
    if (this.props.formatter) {
      return this.props.formatter(num);
    }
    return num;
  }

  render() {
    const props = { ...this.props };
    const { prefixCls = '', disabled, readOnly, max, min } = props;
    const classes = classNames({
      [prefixCls]: true,
      [props.className]: !!props.className,
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focused`]: this.state.focused,
    });
    let upDisabledClass = '';
    let downDisabledClass = '';
    const { value } = this.state;
    if (value) {
      if (!isNaN(value)) {
        const val = Number(value);
        if (val >= (max as number)) {
          upDisabledClass = `${prefixCls}-handler-up-disabled`;
        }
        if (val <= (min as number)) {
          downDisabledClass = `${prefixCls}-handler-down-disabled`;
        }
      } else {
        upDisabledClass = `${prefixCls}-handler-up-disabled`;
        downDisabledClass = `${prefixCls}-handler-down-disabled`;
      }
    }

    const editable = !props.readOnly && !props.disabled;

    // focus state, show input value
    // unfocus state, show valid value
    let inputDisplayValue;
    if (this.state.focused) {
      inputDisplayValue = this.state.inputValue;
    } else {
      inputDisplayValue = this.toPrecisionAsStep(this.state.value);
    }

    if (inputDisplayValue === undefined || inputDisplayValue === null) {
      inputDisplayValue = '';
    }

    let upEvents;
    let downEvents;
    upEvents = {
      onTouchStart: (editable && !upDisabledClass) ? this.up : noop,
      onTouchEnd: this.stop,
    };
    downEvents = {
      onTouchStart: (editable && !downDisabledClass) ? this.down : noop,
      onTouchEnd: this.stop,
    };
    const inputDisplayValueFormat = this.formatWrapper(inputDisplayValue);
    const isUpDisabled = !!upDisabledClass || disabled || readOnly;
    const isDownDisabled = !!downDisabledClass || disabled || readOnly;

    return (
      <div
        className={classes}
        style={props.style}
      >
        <div className={`${prefixCls}-handler-wrap`}>
          <InputHandler
            disabled={isUpDisabled}
            prefixCls={prefixCls}
            unselectable
            {...upEvents}
            role="button"
            aria-label="Increase Value"
            aria-disabled={!!isUpDisabled}
            className={`${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`}
          >
            {this.props.upHandler || <span
              unselectable
              className={`${prefixCls}-handler-up-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
          <InputHandler
            disabled={isDownDisabled}
            prefixCls={prefixCls}
            unselectable
            {...downEvents}
            role="button"
            aria-label="Decrease Value"
            aria-disabled={!!isDownDisabled}
            className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}
          >
            {this.props.downHandler || <span
              unselectable
              className={`${prefixCls}-handler-down-inner`}
              onClick={preventDefault}
            />}
          </InputHandler>
        </div>
        <div
          className={`${prefixCls}-input-wrap`}
          role="spinbutton"
          aria-valuemin={props.min}
          aria-valuemax={props.max}
          aria-valuenow={value}
        >
          <input
            className={`${prefixCls}-input`}
            tabIndex={props.tabIndex}
            autoComplete="off"
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoFocus={props.autoFocus}
            readOnly={props.readOnly}
            disabled={props.disabled}
            max={props.max}
            min={props.min}
            step={props.step}
            onChange={this.onChange}
            ref={this.setInput}
            value={inputDisplayValueFormat}
          />
        </div>
      </div>
    );
  }
}
