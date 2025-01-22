export const formatTrainer = (trainer: any) => {
    return {
        id: trainer.id,
        name: trainer.name,
        trainingSubjects: trainer.trainingSubjects,
        location: trainer.location,
        price: trainer.price,
        email: trainer.email
    };
}