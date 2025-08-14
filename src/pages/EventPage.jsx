import {
  Box,
  Heading,
  Text,
  Image,
  Badge,
  Button,
  useToast,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Input,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEvent, deleteEvent, updateEvent } from "../api/events";
import { useAppContext } from "../context/AppContext";

export const EventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { users, categories } = useAppContext();
  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const loadEvent = async () => {
    const data = await getEvent(id);
    setEvent(data);
    setFormData(data);
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const handleDelete = async () => {
    await deleteEvent(id);
    toast({ title: "Event deleted", status: "success", duration: 2000 });
    navigate("/");
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateEvent(id, formData);
      setEvent(updated);
      toast({ title: "Event updated", status: "success", duration: 2000 });
      setIsEditing(false);
    } catch {
      toast({ title: "Failed to update", status: "error", duration: 2000 });
    }
  };

  if (!event) return <Spinner size="xl" />;

  const creator = users.find((u) => String(u.id) === String(event.createdBy));

  return (
    <Box p={6} maxW="600px" mx="auto">
      {/* Back button */}
      <Button mb={4} onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Image
        src={event.image}
        alt={event.title}
        borderRadius="md"
        maxH="300px"
        objectFit="cover"
        width="100%"
      />
      <Heading mt={4}>
        {isEditing ? (
          <Input
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        ) : (
          event.title
        )}
      </Heading>
      <Text mt={2}>
        {isEditing ? (
          <Textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        ) : (
          event.description
        )}
      </Text>
      <Text mt={2} fontSize="sm" color="gray.600">
        {new Date(event.startTime).toLocaleString()} -{" "}
        {new Date(event.endTime).toLocaleString()}
      </Text>
      <Box mt={2}>
        {(event.categoryIds || []).map((catId) => {
          const cat = categories.find((c) => c.id === catId);
          return (
            <Badge key={catId} mr={2}>
              {cat ? cat.name : "Unknown"}
            </Badge>
          );
        })}
      </Box>

      {creator && (
        <Box mt={4} display="flex" alignItems="center">
          <Image
            src={creator.image}
            alt={creator.name}
            boxSize="40px"
            borderRadius="full"
            mr={2}
          />
          <Text>{creator.name}</Text>
        </Box>
      )}

      <Box mt={6} display="flex" gap={3}>
        {isEditing ? (
          <>
            <Button colorScheme="teal" onClick={handleUpdate}>
              Save
            </Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </>
        ) : (
          <Button colorScheme="teal" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
        <Button
          colorScheme="red"
          onClick={onOpen}
          isDisabled={isEditing} // disable delete when editing
        >
          Delete
        </Button>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Event</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This action is irreversible.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};
