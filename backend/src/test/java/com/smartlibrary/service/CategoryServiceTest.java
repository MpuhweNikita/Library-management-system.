package com.smartlibrary.service;

import com.smartlibrary.dto.CategoryDto;
import com.smartlibrary.entity.Category;
import com.smartlibrary.exception.ResourceNotFoundException;
import com.smartlibrary.repository.BookRepository;
import com.smartlibrary.repository.CategoryRepository;
import com.smartlibrary.service.impl.CategoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private BookRepository bookRepository;

    private CategoryService categoryService;

    @BeforeEach
    void setUp() {
        categoryService = new CategoryServiceImpl(categoryRepository, bookRepository);
    }

    @Test
    void createCategory_Success() {
        CategoryDto dto = new CategoryDto(null, "Biography", "Biographies of famous people");
        Category category = new Category(1L, "Biography", "Biographies of famous people");

        when(categoryRepository.existsByName("Biography")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        CategoryDto result = categoryService.createCategory(dto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Biography", result.getName());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void createCategory_DuplicateName_ThrowsException() {
        CategoryDto dto = new CategoryDto(null, "Biography", "Biographies of famous people");

        when(categoryRepository.existsByName("Biography")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> categoryService.createCategory(dto));
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void updateCategory_Success() {
        CategoryDto dto = new CategoryDto(1L, "Bio", "Updated description");
        Category category = new Category(1L, "Biography", "Biographies of famous people");
        Category updated = new Category(1L, "Bio", "Updated description");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.existsByName("Bio")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(updated);

        CategoryDto result = categoryService.updateCategory(1L, dto);

        assertNotNull(result);
        assertEquals("Bio", result.getName());
        assertEquals("Updated description", result.getDescription());
    }

    @Test
    void getCategoryById_Success() {
        Category category = new Category(1L, "Biography", "Biographies of famous people");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        CategoryDto result = categoryService.getCategoryById(1L);

        assertNotNull(result);
        assertEquals("Biography", result.getName());
    }

    @Test
    void getCategoryById_NotFound_ThrowsException() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryById(1L));
    }

    @Test
    void deleteCategory_Success() {
        Category category = new Category(1L, "Biography", "Biographies of famous people");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(bookRepository.existsByCategoryId(1L)).thenReturn(false);

        categoryService.deleteCategory(1L);

        verify(categoryRepository, times(1)).delete(category);
    }

    @Test
    void deleteCategory_ActiveBooks_ThrowsException() {
        Category category = new Category(1L, "Biography", "Biographies of famous people");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(bookRepository.existsByCategoryId(1L)).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> categoryService.deleteCategory(1L));
        verify(categoryRepository, never()).delete(any(Category.class));
    }

    @Test
    void getAllCategories_Success() {
        Category category1 = new Category(1L, "Biography", "Biographies");
        Category category2 = new Category(2L, "Sci-Fi", "Science fiction");

        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

        List<CategoryDto> result = categoryService.getAllCategories();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Biography", result.get(0).getName());
        assertEquals("Sci-Fi", result.get(1).getName());
    }
}
