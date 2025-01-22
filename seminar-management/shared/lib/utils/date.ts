import dayjs from 'dayjs';
import { APP_LOCAL_DATETIME_FORMAT } from '../config/constants';

const displayDefaultDateTime = () => dayjs().startOf('day').format(APP_LOCAL_DATETIME_FORMAT);

const getDate = (date: any) => (date && dayjs(date).isValid() ? dayjs(date).toDate() : null);

const formatDate = (date: any) => (date && dayjs(date).isValid() ? dayjs(date).format('DD/MM/YYYY') : null);

const formatDateToBackend = (date: any) => (date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : null);

const formatTime = (date: any) => (date && dayjs(date).isValid() ? dayjs(date).format('HH:mm:ss') : null);

export {
    getDate,
    displayDefaultDateTime,
    formatDate,
    formatTime,
    formatDateToBackend
}