import * as Yup from 'yup';

export const VCourse = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(5, 'Name must be at least 5 characters long'),
    date: Yup.date().required('Date is required'),
    subject: Yup.string().required('Subject is required'),
    location: Yup.string().required('Location is required'),
    notes: Yup.string()
        .required('Notes is required')
        .min(0, 'Notes must be at least 0 characters long'),
    participants: Yup.number()
        .required('Participants are required'),
    price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be at least 0'),
    trainerId: Yup.number().nullable()
});