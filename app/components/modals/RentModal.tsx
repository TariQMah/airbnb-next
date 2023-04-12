"use client";
import useRentModal from "@/app/hooks/useRentModal";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";
import ImageUpload from "../inputs/ImageUpload";

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
    const rentModal = useRentModal();
    const [steps, setSteps] = useState(STEPS.CATEGORY);

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
            price: "",
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
    return (
        <Modal
            title="Airbnb your home"
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={onNext}
            actionLabel={actionLabel}
            secondaryAction={steps === STEPS.CATEGORY ? undefined : onBack}
            secondaryActionLabel={secondaryActionLabel}
            body={bodyContent}
        />
    );
};

export default RentModal;
