import React from 'react';
import { classNames } from 'utils/helpers';

const BUTTON_DEFAULTS =
  'inline-flex items-center border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium rounded-md';
const SMALL_DEFAULTS = 'px-2.5 py-1.5 text-sm leading-4';

export const PrimaryButtonSmall = ({ ...props }) => (
  <button
    type="button"
    className={classNames(
      BUTTON_DEFAULTS,
      SMALL_DEFAULTS,
      'border-transparent shadow-sm text-white bg-blue-600 hover:bg-blue-700',
      props.classes
    )}
    {...props}
  />
);

export const SecondaryButtonSmall = ({ ...props }) => (
  <button
    type="button"
    className={classNames(
      BUTTON_DEFAULTS,
      SMALL_DEFAULTS,
      'border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200',
      props.classes
    )}
    {...props}
  />
);

export const WhiteButtonSmall = ({ ...props }) => (
  <button
    type="button"
    className={classNames(
      BUTTON_DEFAULTS,
      SMALL_DEFAULTS,
      'border-gray-300 shadow-sm text-gray-700 bg-white hover:bg-gray-50',
      props.classes
    )}
    {...props}
  />
);
