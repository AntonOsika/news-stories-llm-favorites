import React, { useState, useEffect } from "react";
import { Box, Heading, Text, VStack, Link, Button, List, ListItem, IconButton, useToast, HStack } from "@chakra-ui/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetch("https://hn.algolia.com/api/v1/search?query=LLMs")
      .then((response) => response.json())
      .then((data) => setStories(data.hits))
      .catch((error) => console.error("Error fetching stories:", error));

    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleFavoriteToggle = (story) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.objectID === story.objectID)) {
      updatedFavorites = favorites.filter((fav) => fav.objectID !== story.objectID);
    } else {
      updatedFavorites = [...favorites, story];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    toast({
      title: favorites.some((fav) => fav.objectID === story.objectID) ? "Removed from favorites" : "Added to favorites WOHOO",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const isFavorite = (story) => {
    return favorites.some((fav) => fav.objectID === story.objectID);
  };

  return (
    <VStack spacing={4} p={10}>
      <Heading as="h1" size="xl">
        LLM Stories
      </Heading>
      <List spacing={3} w="full">
        {stories.map((story) => (
          <ListItem key={story.objectID} p={4} shadow="md" borderWidth="1px">
            <HStack justifyContent="space-between" align="center">
              <VStack align="start">
                <Link href={story.url} isExternal color="blue.500">
                  {story.title}
                </Link>
                <Text fontSize="sm">Author: {story.author}</Text>
              </VStack>
              <IconButton icon={isFavorite(story) ? <FaHeart /> : <FaRegHeart />} onClick={() => handleFavoriteToggle(story)} aria-label="Add to favorites" colorScheme={isFavorite(story) ? "red" : "gray"} />
            </HStack>
          </ListItem>
        ))}
      </List>
    </VStack>
  );
};

export default Index;
