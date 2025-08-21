import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserFavorite, House, Picture } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userFavorites = await prisma.userFavorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        house: {
          include: {
            pictures: {
              orderBy: { order: 'asc' }
            }
          }
        },
      },
    });

    return NextResponse.json({ 
      data: userFavorites.map((fav: UserFavorite & { house: House & { pictures: Picture[] } }) => fav.house) 
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { houseId } = body;

    if (!houseId) {
      return NextResponse.json(
        { error: 'House ID is required' },
        { status: 400 }
      );
    }

    // Check if house exists
    const house = await prisma.house.findUnique({
      where: { id: houseId },
    });

    if (!house) {
      return NextResponse.json(
        { error: 'House not found' },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existingFavorite = await prisma.userFavorite.findUnique({
      where: {
        userId_houseId: {
          userId: session.user.id,
          houseId: houseId,
        },
      },
    });

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'House already in favorites' },
        { status: 400 }
      );
    }

    // Add to favorites
    const favorite = await prisma.userFavorite.create({
      data: {
        userId: session.user.id,
        houseId: houseId,
      },
      include: {
        house: {
          include: {
            pictures: {
              orderBy: { order: 'asc' }
            }
          }
        },
      },
    });

    return NextResponse.json({ 
      data: favorite.house,
      message: 'Added to favorites' 
    }, { status: 201 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { houseId } = body;

    if (!houseId) {
      return NextResponse.json(
        { error: 'House ID is required' },
        { status: 400 }
      );
    }

    // Remove from favorites
    await prisma.userFavorite.deleteMany({
      where: {
        userId: session.user.id,
        houseId: houseId,
      },
    });

    return NextResponse.json({ 
      message: 'Removed from favorites' 
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 