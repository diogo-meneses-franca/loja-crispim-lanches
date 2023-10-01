package br.com.crispimlanches.loja_virtual_crispim.service;

import br.com.crispimlanches.loja_virtual_crispim.dto.ImageDTO;
import br.com.crispimlanches.loja_virtual_crispim.entity.Image;
import br.com.crispimlanches.loja_virtual_crispim.repository.ImageRepository;
import br.com.crispimlanches.loja_virtual_crispim.utils.ParseUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ImageServiceImpl implements ImageService{

    private ImageRepository imageRepository;

    @Autowired
    public ImageServiceImpl(ImageRepository imageRepository){
        this.imageRepository = imageRepository;
    }
    @Override
    public ResponseEntity<ImageDTO> create(ImageDTO imageDTO) {
        imageDTO.setStatus(true);
        Image image = imageRepository.saveAndFlush(ParseUtils.parse(imageDTO, Image.class));
        ImageDTO response = ParseUtils.parse(image, ImageDTO.class);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ImageDTO> update(ImageDTO imageDTO) {
        Image image = imageRepository.saveAndFlush(ParseUtils.parse(imageDTO, Image.class));
        ImageDTO response = ParseUtils.parse(image, ImageDTO.class);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> delete(Long imageId) {
        Image image = imageRepository.findById(imageId).get();
        image.setStatus(false);
        return new ResponseEntity<>("Imagem inativada com sucesso", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Page<ImageDTO>> readAll(Pageable pageable) {
        Page<Image> imagePage = imageRepository.findAll(pageable);
        Page<ImageDTO> imageDTOPage = imagePage.map(image -> ParseUtils.parse(image, ImageDTO.class));
        return new ResponseEntity<>(imageDTOPage, HttpStatus.OK);
    }
}
