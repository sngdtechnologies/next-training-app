import * as Yup from 'yup';

export const VTrainer = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name must be less than 50 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format')
        .max(100, 'Email must be less than 100 characters'),
    location: Yup.string().required('Location is required'),
    trainingSubjects: Yup.array()
        .of(Yup.string().min(2, 'Subject must be at least 2 characters long'))
        .required('Training subjects are required')
        .min(1, 'At least one training subject is required'),
    price: Yup.number()
        .required('Price is required')
        .min(0, 'Price must be at least 0')
});

export const VAsignTrainer = Yup.object().shape({
    courseId: Yup.number()
        .required('Course ID is required'),
    trainerId: Yup.number()
        .required('Trainer ID is required')
});