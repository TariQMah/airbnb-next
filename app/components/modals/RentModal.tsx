"use client";
import useRentModal from "@/app/hooks/useRentModal";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";
import ImageUpload from "../inputs/ImageUpload";
import Input from "../inputs/Input";

import { categories } from "../navbar/Categories";
import Modal from "./Modal";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {
    const router = useRouter()
    const rentModal = useRentModal();
    const [steps, setSteps] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            category: "",
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: "",
            price: 1,
            title: "",
            description: "",
        },
    });

    const catergory = watch("category");

    const location = watch("location");
    const guestCount = watch("guestCount");
    const roomCount = watch("roomCount");
    const bathroomCount = watch("bathroomCount");
    const imageSrc = watch("imageSrc");

    const Map = useMemo(
        () =>
            dynamic(() => import("../Map"), {
                ssr: false,
            }),
        [location]
    );

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };

    const onBack = () => {
        setSteps((value) => value - 1);
    };

    const onNext = () => {
        setSteps((value) => value + 1);
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        console.log('data: ', data);
        if (steps !== STEPS.PRICE) {
            return onNext()
        }
        setIsLoading(true)
        axios.post("/api/listings", data).then((res) => {
            toast.success("Listing Created!")
            router.refresh()
            reset()
            setSteps(STEPS.CATEGORY)
            rentModal.onClose()
        }).catch((err) => {
            console.log('err: ', err);
            toast.error("Something went wrong!")
        }).finally(() => {
            setIsLoading(false)
        })
    }

    const actionLabel = useMemo(() => {
        if (steps === STEPS.PRICE) {
            return "Create";
        }
        return "Next";
    }, [steps]);

    const secondaryActionLabel = useMemo(() => {
        if (steps === STEPS.CATEGORY) {
            return undefined;
        }
        return "Back";
    }, [steps]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title="Which of these best describs your place"
                subtitle="Pick a category"
            />

            <div
                className="grid
                grid-cols-1
                md:grid-cols-2
                gap-3
                max-h-[50vh]
                overflow-y-auto
                
                "
            >
                {categories?.map((item) => (
                    <div
                        key={item?.label}
                        className="
                        col-span-1
                        "
                    >
                        {item?.label}
                        <CategoryInput
                            onClick={(category) => setCustomValue("category", category)}
                            selected={catergory === item?.label}
                            label={item?.label}
                            icon={item?.icon}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    if (steps === STEPS.LOCATION) {
        bodyContent = (
            <div
                className="
            flex
            flex-col
            gap-8
            "
            >
                <Heading
                    title="Where is your place located"
                    subtitle="Help us find you"
                />

                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue("location", value)}
                />
                <Map center={location?.latlng} />
            </div>
        );
    }

    if (steps === STEPS.INFO) {
        bodyContent = (
            <div
                className="
            flex
            flex-col
            gap-8
            "
            >
                <Heading
                    title="Share some basics about your place"
                    subtitle="What amentites do you have"
                />

                <Counter
                    onChange={(value) => setCustomValue("guestCount", value)}
                    subtitle="How many guests do you allow?"
                    title="Guests"
                    value={guestCount}
                />

                <Counter
                    onChange={(value) => setCustomValue("roomCount", value)}
                    subtitle="How many room do you have"
                    title="Rooms"
                    value={roomCount}
                />

                <Counter
                    onChange={(value) => setCustomValue("bathroomCount", value)}
                    subtitle="How many bathrooms do you have?"
                    title="Bathrooms"
                    value={bathroomCount}
                />
            </div>
        );
    }
    if (steps === STEPS.IMAGES) {
        bodyContent = (
            <div
                className="
            flex
            flex-col
            gap-8
            "
            >
                <Heading
                    title="Add a photo of your place"
                    subtitle="show guests what your place looks like"
                />
                <ImageUpload onChange={(value) => setCustomValue("imageSrc", value)} value={imageSrc} />
            </div>
        );
    }
    if (steps === STEPS.DESCRIPTION) {
        bodyContent = (
            <div
                className="
            flex
            flex-col
            gap-8
            "
            >
                <Heading
                    title="How would you describe your place"
                    subtitle="Short and sweet works best!"
                />
                <Input id="title" label="Title" required disabled={isLoading} register={register} errors={errors} />
                <hr />
                <Input id="description" required label="Description" disabled={isLoading} register={register} errors={errors} />
            </div>
        );
    }

    if (steps === STEPS.PRICE) {
        bodyContent = (
            <div
                className="
            flex
            flex-col
            gap-8
            "
            >
                <Heading
                    title="Now, set your price"
                    subtitle="How much do you charge per night!"
                />
                <Input id="price" label="Price" disabled={isLoading} formatPrice={true} type="number" register={register} errors={errors} required />

            </div>
        );
    }
    return (
        <Modal
            title="Airbnb your home"
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryAction={steps === STEPS.CATEGORY ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            body={bodyContent}
        />
    );
};

export default RentModal;
