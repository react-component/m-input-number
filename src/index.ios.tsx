import * as React from 'react';
import { Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import BaseComponent, { PropsType as BasePropsType, StateType as BaseStateType } from './base';

export interface PropsType extends BasePropsType {
  styles?: any;
  upStyle?: any;
  downStyle?: any;
  inputStyle?: any;
  keyboardType?: any;
}

export interface StateType extends BaseStateType {
}

export default class InputNumber extends BaseComponent<PropsType, StateType> {

  _stepDown: any;
  _stepDownText: any;
  _stepUp: any;
  _stepUpText: any;

  onPressIn(type: string) {
    if (this.props.disabled) {
      return;
    }
    const { styles } = this.props;
    (this as any)[type].setNativeProps({
      style: [styles.stepWrap, styles.highlightStepBorderColor],
    });
    (this as any)[`${type}Text`].setNativeProps({
      style: [styles.stepText, styles.highlightStepTextColor],
    });
  }

  onPressOut(type: any) {
    if (this.props.disabled) {
      return;
    }
    const { styles } = this.props;
    (this as any)[type].setNativeProps({
      style: [styles.stepWrap],
    });
    (this as any)[`${type}Text`].setNativeProps({
      style: [styles.stepText],
    });
  }

  onPressInDown = (e: any) => {
    this.onPressIn('_stepDown');
    this.down(e, true);
  }
  onPressOutDown = () => {
    this.onPressOut('_stepDown');
    this.stop();
  }

  onPressInUp = (e: any) => {
    this.onPressIn('_stepUp');
    this.up(e, true);
  }

  onPressOutUp = () => {
    this.onPressOut('_stepUp');
    this.stop();
  }

  getValueFromEvent(e: any) {
    return e.nativeEvent.text;
  }

  render() {
    const { props, state } = this;
    const { style, upStyle, downStyle, inputStyle, styles } = this.props;
    const editable = !this.props.readOnly && !this.props.disabled;

    let upDisabledStyle = null;
    let downDisabledStyle = null;
    let upDisabledTextStyle = null;
    let downDisabledTextStyle = null;
    const value = +state.value;
    if (!isNaN(value)) {
      const val = Number(value);
      if (val >= (props.max as number)) {
        upDisabledStyle = styles.stepDisabled;
        upDisabledTextStyle = styles.disabledStepTextColor;
      }
      if (val <= (props.min as number)) {
        downDisabledStyle = styles.stepDisabled;
        downDisabledTextStyle = styles.disabledStepTextColor;
      }
    } else {
      upDisabledStyle = styles.stepDisabled;
      downDisabledStyle = styles.stepDisabled;
      upDisabledTextStyle = styles.disabledStepTextColor;
      downDisabledTextStyle = styles.disabledStepTextColor;
    }

    let inputDisabledStyle = null;
    if (props.disabled) {
      upDisabledStyle = styles.stepDisabled;
      downDisabledStyle = styles.stepDisabled;
      upDisabledTextStyle = styles.disabledStepTextColor;
      downDisabledTextStyle = styles.disabledStepTextColor;
      inputDisabledStyle = styles.disabledStepTextColor;
    }

    let inputDisplayValue;
    if (state.focused) {
      inputDisplayValue = `${state.inputValue}`;
    } else {
      inputDisplayValue = `${state.value}`;
    }

    if (inputDisplayValue === undefined) {
      inputDisplayValue = '';
    }

    return (
      <View style={[styles.container, style]}>
        <TouchableWithoutFeedback
          onPressIn={(editable && !downDisabledStyle) ? this.onPressInDown : undefined}
          onPressOut={(editable && !downDisabledStyle) ? this.onPressOutDown : undefined}
          accessible
          accessibilityLabel="Decrease Value"
          accessibilityComponentType="button"
          accessibilityTraits={(editable && !downDisabledStyle) ? 'button' : 'disabled'}
        >
          <View
            ref={component => this._stepDown = component}
            style={[styles.stepWrap, downDisabledStyle, downStyle]}
          >
            <Text
              ref={component => this._stepDownText = component}
              style={[styles.stepText, downDisabledTextStyle]}
            >-</Text>
          </View>
        </TouchableWithoutFeedback>
        <TextInput
          style={[styles.input, inputDisabledStyle, inputStyle]}
          value={inputDisplayValue}
          autoFocus={props.autoFocus}
          editable={editable}
          onFocus={this.onFocus}
          onEndEditing={this.onBlur}
          onChange={this.onChange}
          underlineColorAndroid="transparent"
          keyboardType={props.keyboardType}
        />
        <TouchableWithoutFeedback
          onPressIn={(editable && !upDisabledStyle) ? this.onPressInUp : undefined}
          onPressOut={(editable && !upDisabledStyle) ? this.onPressOutUp : undefined}
          accessible
          accessibilityLabel="Increase Value"
          accessibilityComponentType="button"
          accessibilityTraits={(editable && !upDisabledStyle) ? 'button' : 'disabled'}
        >
          <View
            ref={component => this._stepUp = component}
            style={[styles.stepWrap, upDisabledStyle, upStyle]}
          >
            <Text
              ref={component => this._stepUpText = component}
              style={[styles.stepText, upDisabledTextStyle]}
            >+</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
