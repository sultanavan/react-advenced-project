import { Box, Badge, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const EventCard = ({ event, categories }) => {
  const navigate = useNavigate();

  const categoryNames = event.categoryIds.map((catId) => {
    const category = categories.find((c) => c.id === catId);
    return {
      id: catId,
      name: category ? category.name : "Unknown",
    };
  });

  const handleClick = () => {
    navigate(`/event/${event.id}`);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      p={4}
      cursor="pointer"
      onClick={handleClick}
      _hover={{ boxShadow: "md" }}
    >
      <Image
        src={event.image}
        alt={event.title}
        width="100%"
        height="200px" // fixed height
        objectFit="cover" // crop & scale properly
        borderRadius="md"
      />
      <Text fontWeight="bold" mt={2}>
        {event.title}
      </Text>
      <Box mt={1}>
        {categoryNames.map(({ id, name }) => (
          <Badge key={id} mr={1}>
            {name}
          </Badge>
        ))}
      </Box>
    </Box>
  );
};

export default EventCard;
