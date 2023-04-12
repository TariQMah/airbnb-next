import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb"

import getCurentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    const currentUser = await getCurentUser()
    if (!currentUser) {
        return NextResponse.error()
    }
    const body = await request.json()
    const {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        location,
        price
    } = body

    const listing = await prisma.listing.create({
        data: {
            title,
            bathroomCount,
            category,
            description,
            guestCount,
            imageSrc,
            locationValue: location.value,
            price: parseInt(price, 10),
            roomCount,
            userId: currentUser.id
        }
    })

    return NextResponse.json(listing)
}