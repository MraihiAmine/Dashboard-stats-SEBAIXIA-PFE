package com.lapeyre.dashboard.nectartools.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lapeyre.dashboard.nectartools.models.input_data.ResumeDecompoDto;

import java.io.InputStream;
import java.sql.Blob;

public class BlobUtils {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static ResumeDecompoDto deserializeBlobToResumeDecompo(Blob blob) {
        try (InputStream inputStream = blob.getBinaryStream()) {
            return objectMapper.readValue(inputStream, ResumeDecompoDto.class);
        } catch (Exception e) {
            throw new RuntimeException("Error reading blob", e);
        }
    }
}
