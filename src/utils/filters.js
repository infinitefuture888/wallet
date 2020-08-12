import moment from 'dayjs';
import {
  get
} from 'lodash';
import numeral from 'numeral';
import {
  gardplorerDomain
} from '@/constants';

export const upper = s => s.toUpperCase();

export const gardAddr = s => s && s.slice(0, 8) + '......' + s.slice(s.length - 8);

export const gardValidator = s => s && s.slice(0, 7) + '......' + s.slice(s.length - 4);

export const explorerUrl = s => `${gardplorerDomain}${s}`;

export const formatTime = time =>
  time && time.match(/\d{10}/) ? moment.unix(time).format('YYYY-MM-DD HH:mm:ss') : moment(time).format('YYYY-MM-DD HH:mm:ss');

export const formatNumber = v => (v ? numeral(v.toString()).format('0,0.[00]') : 0);