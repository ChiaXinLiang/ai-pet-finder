import { useState, useEffect } from "react";
import Image from "next/image";
import Markdown from "react-markdown";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import type { Pet } from "@/pets";

export default function PetCard({
  id,
  recommendation,
}: {
  id: string;
  recommendation: string;
}) {
  const [pet, setPet] = useState<Pet | null>(null);

  useEffect(() => {
    fetch(`/api/pet/${id}`)
      .then((res) => res.json())
      .then((data) => setPet(data));
  }, [id]);

  if (!pet) return null;

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle>{pet.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Carousel>
          <CarouselContent>
            {pet.images.map((image) => (
              <CarouselItem key={image}>
                <Image src={image} alt={pet.name} width={600} height={450} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="pt-8 flex flex-wrap gap-2">
          <p>
            <span className="font-bold">Age</span> {pet.age.toPrecision(1)}{" "}
            years
          </p>
          <p>
            <span className="font-bold">Weight</span> {pet.weight} lbs
          </p>
          <p>
            <span className="font-bold">Breed</span> {pet.breed}
          </p>
          <p>
            <span className="font-bold">Sex</span> {pet.sex}
          </p>
        </div>
        <div className="pt-8 italic">
          <Markdown>{recommendation}</Markdown>
        </div>
      </CardContent>
    </Card>
  );
}
