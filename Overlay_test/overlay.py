import cv2
import json
import os
import numpy as np

with open('/Users/manishkhadka/Project/admin-backend/Overlay_test/Test_images/annotations.json', 'r') as f:
    annotations = json.load(f)

def draw_annotations(image_name, annotations):
    image_path = os.path.join("/Users/manishkhadka/Project/admin-backend/Overlay_test/Test_images", image_name)
    if not os.path.exists(image_path):
        print(f"Error: Image {image_name} not found at {image_path}")
        return
    image = cv2.imread(image_path)

    for annotation in annotations:
        start_point = tuple(annotation['start'])
        end_point = tuple(annotation['end'])
        text = annotation['text']
        text_pos = tuple(annotation['text_pos'])

        # Calculating the direction of the arrow
        dx = end_point[0] - start_point[0]
        dy = end_point[1] - start_point[1]

        # Adjusting text position based on arrow direction
        if abs(dx) > abs(dy):  # Horizontal arrow
            if dx > 0:  # Arrow points to the right
                text_pos = (end_point[0] + 20, end_point[1])
            else:  # Arrow points to the left
                text_pos = (start_point[0] + 20, start_point[1])
        else:  # Vertical arrow
            if dy > 0:  # Arrow points downward
                text_pos = (end_point[0], end_point[1] + 40)
            else:  # Arrow points upward
                text_pos = (start_point[0], start_point[1] - 20)

        # Drawing the arrow
        arrow_color = (0, 255, 255)  # Yellow color for the arrows (color-blind friendly)
        arrow_thickness = 22
        cv2.arrowedLine(image, start_point, end_point, arrow_color, arrow_thickness, tipLength=0.1)

        # Draw the text with a black outline and wrap long text
        font = cv2.FONT_HERSHEY_SIMPLEX
        text_color = (255, 255, 255)  # White text for contrast
        outline_color = (0, 0, 0)  # Black outline
        font_scale = 2.3
        thickness = 6
        line_spacing = 10  # Space between lines

        # Splitting text into multiple lines if it's too long
        max_width = 900  # Maximum width of text before wrapping
        words = text.split()
        lines = []
        current_line = words[0]

        for word in words[1:]:
            # Checking if adding the next word exceeds the max width
            (line_width, _), _ = cv2.getTextSize(current_line + " " + word, font, font_scale, thickness)
            if line_width <= max_width:
                current_line += " " + word
            else:
                lines.append(current_line)
                current_line = word
        lines.append(current_line)  

        
        for i, line in enumerate(lines):
            y = text_pos[1] + i * (cv2.getTextSize(line, font, font_scale, thickness)[0][1] + i * line_spacing)
          
            cv2.putText(image, line, (text_pos[0], y), font, font_scale, outline_color,thickness + 15, cv2.LINE_AA)
           
            cv2.putText(image, line, (text_pos[0], y), font, font_scale, text_color, thickness, cv2.LINE_AA)

    cv2.imshow(f"Annotated Image - {image_name}", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

for image_name, image_annotations in annotations.items():
    if os.path.exists(image_name):
        draw_annotations(image_name, image_annotations)
    else:
        print(f"Image {image_name} not found!")