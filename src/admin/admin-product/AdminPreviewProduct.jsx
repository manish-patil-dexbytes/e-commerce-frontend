import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { Carousel as ImageCarousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ProductPreview = (props) => {
  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} size="lg">
        <Modal.Header style={{ backgroundColor: "#e3974b" }} closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "transparent" }}>
          <Row>
            <Col
              sm={8}
              style={{ marginLeft: "200px", height: "350px", width: "450px" }}
            >
              <ImageCarousel showArrows={true} showThumbs={true}>
                {props.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Product Image ${index}`}
                  />
                ))}
                {props.videos.map((video, index) => (
                  <div
                    key={index}
                    style={{
                      height: "280px",
                      width: "450px",
                    }}
                  >
                    <video
                      controls
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    >
                      <source
                        src={URL.createObjectURL(video)}
                        type={video.type}
                      />
                    </video>
                  </div>
                ))}
              </ImageCarousel>
            </Col>
            <Col sm={12}>
              <p>
                <strong>{`${props.product} (${props.sku})`}</strong>
              </p>
              <p>
                <strong>Category:</strong>
                {props.category}
              </p>

              <p>
                <strong>Price:</strong>
                {props.price}
              </p>
              <p>
                <strong>Description :</strong>
                {props.description}
              </p>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductPreview;
